import { useRef, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { useLeafletMap } from "./useLeafletMap";

export const MapWrapper: FC = () => {
  const { showCoords, tileSource } = useMapStore(useShallow(state => ({
    showCoords: state.showCoords,
    tileSource: state.tileSource,
  })));

  const mapContainerRef = useRef<HTMLDivElement>(null);
  useLeafletMap(mapContainerRef, tileSource, { lat: 54, long: -69.7 }, 5);

  const wrappperClasses = clsx("map-wrapper", showCoords && "show-coords");

  return (
    <div className={wrappperClasses}>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapWrapper;
