import { RefObject, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import L from "leaflet";

import { geoJson } from "../../data/data";
import { Nation, State, TileProvider } from "../../shared/types";
import { createTileLayer, addCoordsControl, addNationLayers, addZoomControl } from "./mapUtils";
import { useMapStore } from "../../shared/store";

export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement>,
  tileSource: TileProvider,
  selectedNations: Nation[],
  selectedStates: State[],
) => {
  const mapRef = useRef<L.Map | null>(null);
  const syncRef = useRef<() => void>(() => {});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const allMarkersRef = useRef<L.Marker[]>([]);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  const setViewport = useMapStore(state => state.setViewport);
  const savedViewport = useMapStore(useShallow(state => state.viewport));

  // Helper to handle Polygons (which stay on the map)
  const processLayer = (layer: any, map: L.Map, nations: string[], states: string[]) => {
    if (!layer._meta) return;

    const { nation, bounds, states: layerStates } = layer._meta;
    const isSelected = nations.includes(nation) && states.some(s => layerStates.includes(s));

    const nw = map.latLngToLayerPoint(bounds.getNorthWest());
    const se = map.latLngToLayerPoint(bounds.getSouthEast());
    const pixelArea = Math.abs(se.x - nw.x) * Math.abs(se.y - nw.y);

    const THRESHOLD = 2000;

    if (layer instanceof L.GeoJSON) {
      const shouldShowPoly = isSelected && pixelArea >= THRESHOLD;
      layer.setStyle({
        opacity: shouldShowPoly ? 1 : 0,
        fillOpacity: shouldShowPoly ? 0.3 : 0,
        interactive: shouldShowPoly
      });
    }
  };
  useEffect(() => {
    // Update the syncing function every time state changes
    syncRef.current = () => {
      const map = mapRef.current;
      const clusterGroup = clusterGroupRef.current;
      if (!map || !clusterGroup) return;

      const activeNations = selectedNations;
      const activeStates = selectedStates;
      const THRESHOLD = 2000;

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
          
          const shouldShowPin = pixelArea < THRESHOLD;
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
  }, [selectedNations, selectedStates]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize Map
    const map = L.map(containerRef.current, {
      center: [savedViewport.lat, savedViewport.lng],
      zoom: savedViewport.zoom,
      maxZoom: 18, // this is needed for clustering
    });
    mapRef.current = map;

    // Add Controls/Layers
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

  // Runs when toggling nation visibility checkboxes
  useEffect(() => {
    syncRef.current();
  }, [selectedNations, selectedStates]);

  // Swap tile layer when provider changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    tileLayerRef.current = createTileLayer(tileSource);
    tileLayerRef.current.addTo(mapRef.current);
  }, [tileSource]);

  return mapRef;
};
