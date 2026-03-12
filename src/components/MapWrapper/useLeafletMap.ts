import { RefObject, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
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
} from "./mapUtils";
import { Nation } from "../../shared/types";
import { useMapStore } from "../../shared/store";
import { MIN_PIXEL_AREA, nationColorMap } from "../../shared/constants";

export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement>,
) => {
  const mapRef = useRef<L.Map | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const allMarkersRef = useRef<L.Marker[]>([]);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const hullLayersRef = useRef<Map<Nation, L.Polygon>>(new Map());
  const hullLabelRef = useRef<Map<Nation, L.Marker>>(new Map());

  const forcePolygons = useMapStore(useShallow(state => state.forcePolygons));
  const setViewport = useMapStore(state => state.setViewport);
  const savedViewport = useMapStore(useShallow(state => state.viewport));

  const { activeNations, activeStates, showConvexHulls, tileSource, viewport } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    activeStates: state.activeStates,
    showConvexHulls: state.showConvexHulls,
    tileSource: state.tileSource,
    viewport: state.viewport,
  })));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize the map
    const map = L.map(containerRef.current, {
      center: [savedViewport.lat, savedViewport.lng],
      zoom: savedViewport.zoom,
      maxZoom: 18, // this is needed for clustering
    });

    mapRef.current = map;

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
        allMarkersRef.current.forEach((marker) => {
          // Cast to any to access our custom _meta property
          const meta = (marker as any)._meta;
          if (!meta) return;

          const { nation, states: layerStates, bounds } = meta;
          
          const isSelected = activeNations.includes(nation) && activeStates.some(s => layerStates.includes(s));

          if (isSelected) {
            // Ensure it's in the cluster group so the count is correct
            if (!clusterGroup.hasLayer(marker)) {
              clusterGroup.addLayer(marker);
            }
            
            // Handle Dot-vs-Polygon swap within the cluster
            const nw = map.latLngToLayerPoint(bounds.getNorthWest());
            const se = map.latLngToLayerPoint(bounds.getSouthEast());
            const pixelArea = Math.abs(se.x - nw.x) * Math.abs(se.y - nw.y);
            
            const polygonThreshold = forcePolygons ? 0 : MIN_PIXEL_AREA;
            const shouldShowPin = pixelArea < polygonThreshold;
            marker.setOpacity(shouldShowPin ? 1 : 0);
            
            const el = marker.getElement();
            if (el) {
              el.style.pointerEvents = shouldShowPin ? 'auto' : 'none';
            }
          } else {
            // Physically remove from cluster so the bubble number updates
            clusterGroup.removeLayer(marker);
          }
        });
      } else {
        // Hide all markers when hull mode is active
        allMarkersRef.current.forEach((marker) => {
          marker.setOpacity(0);
          const el = marker.getElement();
          if (el) el.style.pointerEvents = 'none';
        });
      }
      
      // Enable or not polygons visibility
      map.eachLayer((layer) => {
        if (!(layer instanceof L.Marker)) {
          processPolygonsLayer(layer, map, activeNations, activeStates, showConvexHulls, forcePolygons);
        }
      });

      // Enable or not hulls visibility
      const hullLayers = hullLayersRef.current;

      hullLayers.forEach((layer, nation) => {
        const shouldShow = showConvexHulls && activeNations.includes(nation);

        layer.setStyle({
          opacity: shouldShow ? 0.8 : 0,
          fillOpacity: shouldShow ? 0.25 : 0
        });
      });

      // Enable nation labels visibility
      const zoom = viewport.zoom;

      hullLabelRef.current.forEach((label, nation) => {
        const shouldShowLabel = showConvexHulls && activeNations.includes(nation) && zoom < 8; // adjust zoom threshold
        label.setOpacity(shouldShowLabel ? 1 : 0);
      });

    };
  }, [activeNations, activeStates, forcePolygons, viewport.zoom, showConvexHulls]);

  useEffect(() => {
    // Runs when toggling nation or state visibility checkboxes
    syncRef.current();
  }, [activeNations, activeStates, showConvexHulls, forcePolygons]);

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
