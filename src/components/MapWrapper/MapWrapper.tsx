import { useEffect, useRef, type FC } from "react";
import clsx from "clsx";

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { useLeafletMap } from "./useLeafletMap";
import { MARKER_INNER_RADIUS, MARKER_INNER_STROKE, MARKER_OUTER_RADIUS } from "../../shared/constants";

export const MapWrapper: FC = () => {
  const activeNations = useMapStore(s => s.activeNations);
  const showCoords = useMapStore(s => s.showCoords);
  const showScale = useMapStore(s => s.showScale);
  const showZoom = useMapStore(s => s.showZoom);

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
    showScale && "show-scale",
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
