import { useEffect, useRef, type FC } from "react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { useLeafletMap } from "./useLeafletMap";
import { MARKER_INNER_RADIUS, MARKER_INNER_STROKE, MARKER_OUTER_RADIUS } from "../../shared/constants";

export const MapWrapper: FC = () => {
  const { activeNations, showCoords, showZoom } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    showCoords: state.showCoords,
    showZoom: state.showZoom,
  })));

  // Inject constants for use in CSS
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--marker-outer-radius', `${MARKER_OUTER_RADIUS}px`);
    root.style.setProperty('--marker-inner-radius', `${MARKER_INNER_RADIUS}px`);
    root.style.setProperty('--marker-inner-stroke', `${MARKER_INNER_STROKE}px`);
  }, []);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  useLeafletMap(mapContainerRef);

  const nationClasses = activeNations.map(nation => `show-${nation}`);
  const wrappperClasses = clsx(
    "map-wrapper",
    showCoords && "show-coords",
    showZoom && "show-zoom",
    nationClasses,
  );

  return (
    <div className={wrappperClasses}>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapWrapper;
