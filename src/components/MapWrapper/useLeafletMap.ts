import { RefObject, useEffect, useRef } from "react";
import L from "leaflet";

import { Coords, TileProvider } from "../../shared/types";
import { createTileLayer, addCoordsControl } from "./mapUtils";

export const useLeafletMap = (
  containerRef: RefObject<HTMLDivElement>,
  tileSource: TileProvider,
  initialCenter: Coords,
  initialZoom: number
) => {
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Create map ONCE
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(
      [initialCenter.lat, initialCenter.long],
      initialZoom
    );

    addCoordsControl(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tile layers when provider changes
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
