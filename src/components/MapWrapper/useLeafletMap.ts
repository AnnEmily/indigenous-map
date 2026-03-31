import { RefObject, useEffect, useRef } from "react";
import * as turf from '@turf/turf';
import L from "leaflet";

import { geoJson } from "../../data/geoJson";
import {
  closeGeoJsonRings,
  createTileLayer,
  addCoordsControl,
  addNationLayers,
  addZoomControl,
  computeNationHulls,
  getClosedCoords,
  processPolygonsLayer,
  sanityCheckGeoJson,
  getPolygonArea,
  setMarkersVisibility,
  setMarkersSize,
} from "./mapUtils";
import { MarkerMeta, Nation } from "../../shared/types";
import { useMapStore } from "../../shared/store";
import { DISABLE_CLUSTERING_AT_ZOOM, MIN_PIXEL_AREA, nationColorMap } from "../../shared/constants";

export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement>,
) => {
  const mapRef = useRef<L.Map | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const tileLayerRef = useRef<L.Layer | null>(null);
  const allMarkersRef = useRef<L.Marker[]>([]);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const hullLayersRef = useRef<Map<Nation, L.Polygon>>(new Map());
  const hullLabelRef = useRef<Map<Nation, L.Marker>>(new Map());

  const forcePolygons = useMapStore(state => state.forcePolygons);
  const setViewport = useMapStore(state => state.setViewport);
  const savedViewport = useMapStore(state => state.viewport);

  const activeNations = useMapStore(state => state.activeNations);
  const activeStates = useMapStore(state => state.activeStates);
  const enableClustering = useMapStore(state => state.enableClustering);
  const showConvexHulls = useMapStore(state => state.showConvexHulls);
  const tileSource = useMapStore(state => state.tileSource);
  const viewport = useMapStore(state => state.viewport);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize the map
    const map = L.map(containerRef.current, {
      center: [savedViewport.lat, savedViewport.lng],
      zoom: savedViewport.zoom,
      maxZoom: 18, // this is needed for clustering
    });

    mapRef.current = map;

    map.createPane('basemapLabels');
    map.getPane('basemapLabels')!.style.zIndex = '650'; /// markers at zIndex = 600
    map.getPane('basemapLabels')!.style.pointerEvents = 'none';

    // Pre-flight data check & fix
    sanityCheckGeoJson(geoJson);
    const fixedGeoJson = closeGeoJsonRings(geoJson);

    // Add controls + layers
    addCoordsControl(map);
    addZoomControl(map);

    // Add community markers
    const { clusterGroup, allMarkers } = addNationLayers(map, fixedGeoJson);
    clusterGroupRef.current = clusterGroup;
    allMarkersRef.current = allMarkers;

    // Add nation convex hulls
    const hullLayers = computeNationHulls(fixedGeoJson);
    hullLayersRef.current = hullLayers;

    hullLayers.forEach((layer) => {
      layer.addTo(map);
      layer.setStyle({ opacity: 0, fillOpacity: 0 });
    });

    // Add nation hull labels
    const hullLabels = new Map<Nation, L.Marker>();

    hullLayers.forEach((hull, nation) => {
      // Extract the polygon coordinates from the Leaflet hull layer
      const latLngs = (hull.getLatLngs() as L.LatLng[][])[0];
      const coords = getClosedCoords(latLngs);

      const turfHull = turf.polygon([coords]);
      const centroid = turf.centroid(turfHull).geometry.coordinates; // [lng, lat]
      const labelLatLng = L.latLng(centroid[1], centroid[0]);
      const nationColor = nationColorMap.get(nation);

      // Create a non-interactive label marker
      const label = L.marker(labelLatLng, {
        icon: L.divIcon({
          className: 'nation-label',
          html: `<div style="color:${nationColor}">${nation}</div>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10],
        }),
        interactive: false
      });

      label.addTo(map);
      label.setOpacity(0);

      hullLabels.set(nation, label);
    });

    hullLabelRef.current = hullLabels;

    // Track viewport changes
    const handleMove = () => {
      const center = map.getCenter();
      const currentZoom = map.getZoom();

      setViewport({
        lat: center.lat,
        lng: center.lng,
        zoom: currentZoom,
      });
    };

    // Update state on significant events
    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);
    
    // Attach the zoom listener. Call the ref specifically so it always
    // sees the latest logic about showing pins or polygons
    const handleZoom = () => syncRef.current();
    map.on('zoomend', handleZoom);

    // Create one single tooltip for the whole map
    const globalTooltip = L.tooltip({
      sticky: false,
      direction: 'top',
      offset: [0, -15],
      className: 'custom-tooltip',
      permanent: false
    });

    // Add global listener to the map
    map.on('mousemove', (e) => {
      if (globalTooltip.isOpen()) {
        globalTooltip.setLatLng(e.latlng);
      }
    });

    return () => {
      map.off('zoomend', handleZoom);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update the syncing function every time state changes
    syncRef.current = () => {
      const map = mapRef.current;
      const clusterGroup = clusterGroupRef.current;

      if (!map || !clusterGroup) return;

      const clusteringActive = enableClustering && !showConvexHulls && viewport.zoom < DISABLE_CLUSTERING_AT_ZOOM;

      // Hull mode removes clustering entirely
      if (showConvexHulls) {
        if (map.hasLayer(clusterGroup)) {
          map.removeLayer(clusterGroup);
        }
      } else {
        if (!map.hasLayer(clusterGroup)) {
          map.addLayer(clusterGroup);
        }
      }

      // Enable or not markers visibility
      if (!showConvexHulls) {
        const visibleMarkers: L.Marker[] = [];
        const hiddenMarkers: L.Marker[] = [];

        allMarkersRef.current.forEach((marker) => {
          // Cast to any to access our custom _meta property
          const meta = (marker as any)._meta as MarkerMeta;

          if (!meta) return;

          const { nation, states: layerStates, bounds } = meta;
          
          const isSelected = activeNations.includes(nation) && activeStates.some(s => layerStates.includes(s));

          if (isSelected) {
            // Move markers between clutering layer or map layer

            if (clusteringActive) {
              if (meta.container !== "cluster") {
                map.removeLayer(marker);
                clusterGroup.addLayer(marker); // AEG unsure
                meta.container = "cluster";
              }
            } else {
              if (meta.container !== "map") {
                clusterGroup.removeLayer(marker);
                marker.addTo(map);
                meta.container = "map";
              }
            }

            // Handle Dot-vs-Polygon swap
            const polygonArea = getPolygonArea(map, bounds);

            if (forcePolygons || polygonArea > MIN_PIXEL_AREA) {
              hiddenMarkers.push(marker);
            } else {
              visibleMarkers.push(marker);
            }
          } else {
            // Physically remove from cluster so the bubble number updates
            clusterGroup.removeLayer(marker);
            map.removeLayer(marker);
            meta.container = null;
          }
        });

        const zoom = map.getZoom();
        setMarkersSize(zoom);

        setMarkersVisibility(visibleMarkers, true);
        setMarkersVisibility(hiddenMarkers, false);

      } else {
        // Hide all markers when hull mode is active
        setMarkersVisibility(allMarkersRef.current, false);
        
        // AEG Another method, but non-selective
        // mapRef.current.getContainer().classList.add('markers-hidden');
      }
      
      // Enable or not polygons visibility
      map.eachLayer((layer) => {
        if (!(layer instanceof L.CircleMarker)) {
          processPolygonsLayer(layer, map, activeNations, activeStates, showConvexHulls, forcePolygons);
        }
      });

      // Enable or not hulls visibility
      const hullLayers = hullLayersRef.current;

      hullLayers.forEach((layer, nation) => {
        const shouldShowHull = showConvexHulls && activeNations.includes(nation);

        layer.setStyle({
          opacity: shouldShowHull ? 0.8 : 0,
          fillOpacity: shouldShowHull ? 0.25 : 0
        });
      });

      // Enable nation labels visibility
      const zoom = viewport.zoom;

      hullLabelRef.current.forEach((label, nation) => {
        const shouldShowLabel = showConvexHulls && activeNations.includes(nation) && zoom < 8; // adjust zoom threshold
        label.setOpacity(shouldShowLabel ? 1 : 0);
      });

    };
  }, [activeNations, activeStates, enableClustering, forcePolygons, viewport.zoom, showConvexHulls]);

  useEffect(() => {
    // Runs when toggling nation or state visibility checkboxes
    syncRef.current();
  }, [activeNations, activeStates, showConvexHulls, enableClustering, forcePolygons]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Swap tile layer when provider changes
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    tileLayerRef.current = createTileLayer(tileSource);
    tileLayerRef.current.addTo(mapRef.current);
  }, [tileSource]);

  return mapRef;
};
