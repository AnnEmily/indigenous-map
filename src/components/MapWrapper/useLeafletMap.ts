import { RefObject, useEffect, useRef } from "react";
import L from "leaflet";

import { Coords, TileProvider } from "../../shared/types";
import { createTileLayer, addCoordsControl, addMarkers } from "./mapUtils";

export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement>,
  tileSource: TileProvider,
  initialCenter: Coords,
  initialZoom: number
) => {
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Create map ONCE
  // useEffect(() => {
  //   if (!containerRef.current || mapRef.current) return;

  //   mapRef.current = L.map(containerRef.current).setView(
  //     [initialCenter.lat, initialCenter.long],
  //     initialZoom
  //   );

  //   addCoordsControl(mapRef.current);
  //   addMarkers(mapRef.current);

  //   return () => {
  //     mapRef.current?.remove();
  //     mapRef.current = null;
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Create map ONCE
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // 1. Initialize Map
    const map = L.map(containerRef.current).setView(
      [initialCenter.lat, initialCenter.long],
      initialZoom
    );
    mapRef.current = map;

    // 2. Zoom Tracking Logic
    const container = containerRef.current;
    const updateZoomAttr = () => {
      const currentZoom = map.getZoom();
      // Injects the zoom level directly into CSS as a variable
      container.style.setProperty('--map-zoom', currentZoom.toString());
    };

    // Attach listener
    map.on('zoomend', updateZoomAttr);
    
    // Set the initial zoom value immediately
    updateZoomAttr();

    // 3. Add Controls/Markers
    addCoordsControl(map);
    addMarkers(map);

    return () => {
      // Cleanup listener and map
      map.off('zoomend', updateZoomAttr);
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
