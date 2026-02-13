import { RefObject, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import L from "leaflet";

import { geoJson } from "../../data/data";
import { createTileLayer, addCoordsControl, addNationLayers, addZoomControl, processLayer } from "./mapUtils";
import { useMapStore } from "../../shared/store";
import { MIN_PIXEL_AREA } from "../../shared/constants";

export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement>,
) => {
  const mapRef = useRef<L.Map | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const allMarkersRef = useRef<L.Marker[]>([]);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  const setViewport = useMapStore(state => state.setViewport);
  const savedViewport = useMapStore(useShallow(state => state.viewport));

  const { activeNations, activeStates, tileSource } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    activeStates: state.activeStates,
    tileSource: state.tileSource,
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

    // Add controls + layers
    addCoordsControl(map);
    addZoomControl(map);

    const { clusterGroup, allMarkers } = addNationLayers(map, geoJson);
    clusterGroupRef.current = clusterGroup;
    allMarkersRef.current = allMarkers;

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

      // Handle Markers (The Clusters)
      // We iterate over our MASTER LIST to add/remove from the cluster group
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
          
          const shouldShowPin = pixelArea < MIN_PIXEL_AREA;
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

      // Handle Polygons (The Map Layers)
      map.eachLayer((layer) => {
        if (!(layer instanceof L.Marker)) {
          processLayer(layer, map, activeNations, activeStates);
        }
      });
    };
  }, [activeNations, activeStates]);

  useEffect(() => {
    // Runs when toggling nation or state visibility checkboxes
    syncRef.current();
  }, [activeNations, activeStates]);

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
