import { RefObject, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import L from "leaflet";

import { geoJson } from "../../data/data";
import { Nation, State, TileProvider } from "../../shared/types";
import { createTileLayer, addCoordsControl, addNationLayers } from "./mapUtils";
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

  const setViewport = useMapStore(state => state.setViewport);
  const savedViewport = useMapStore(useShallow(state => state.viewport));

  // Update the syncing function every time state changes
  useEffect(() => {
    syncRef.current = () => {
      const map = mapRef.current;
      if (!map) return;

      // Use the latest selectedNations from the component scope
      const activeNations = selectedNations;
      const activeStates = selectedStates;

      map.eachLayer((layer: any) => {
        if (layer._meta) {
          const { nation, bounds, states } = layer._meta;
          const isSelected = activeNations.includes(nation) && activeStates.some(s => states.includes(s)) ;
          
          const nw = map.latLngToLayerPoint(bounds.getNorthWest());
          const se = map.latLngToLayerPoint(bounds.getSouthEast());
          const pixelArea = Math.abs(se.x - nw.x) * Math.abs(se.y - nw.y);
          
          const THRESHOLD = 2000;
          const DELTA = 100;

          if (layer instanceof L.Marker) {
            const el = layer.getElement();
            if (el) {
              const shouldShowPin = isSelected && pixelArea < THRESHOLD + DELTA;
              if (shouldShowPin) {
                el.classList.remove('zoom-hidden');
              } else {
                el.classList.add('zoom-hidden');
              }
            }
          }

          if (layer instanceof L.GeoJSON) {
            const shouldShowLayer = isSelected && pixelArea >= THRESHOLD - DELTA;

            layer.setStyle({
              opacity: shouldShowLayer ? 1 : 0,
              fillOpacity: shouldShowLayer ? 0.3 : 0,
              interactive: shouldShowLayer // Important for hovering/clicking
            });
          }
        }
      });
      
      // Also update the zoom CSS variable
      containerRef.current?.style.setProperty('--map-zoom', map.getZoom().toString());
    };
  }, [selectedNations, selectedStates, containerRef]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize Map
    const map = L.map(containerRef.current).setView(
      [savedViewport.lat, savedViewport.lng],
      savedViewport.zoom
    );
    mapRef.current = map;

    // Add Controls/Layers
    addCoordsControl(map);
    addNationLayers(map, geoJson);

    // Track viewport changes
    const handleMove = () => {
      const center = map.getCenter();
      setViewport({
        lat: center.lat,
        lng: center.lng,
        zoom: map.getZoom(),
      });
    };

    map.on('moveend', handleMove);
    
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
