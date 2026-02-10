import { useRef, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { useLeafletMap } from "./useLeafletMap";

export const MapWrapper: FC = () => {
  const { activeNations, activeStates, showCoords, tileSource } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    activeStates: state.activeStates,
    showCoords: state.showCoords,
    tileSource: state.tileSource,
  })));

  const mapContainerRef = useRef<HTMLDivElement>(null);
  useLeafletMap(mapContainerRef, tileSource, activeNations, activeStates);

  const nationClasses = activeNations.map(nation => `show-${nation}`);
  const wrappperClasses = clsx(
    "map-wrapper",
    showCoords && "show-coords",
    nationClasses,
  );

  return (
    <div className={wrappperClasses}>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapWrapper;
