import { FC } from "react";

import { useMapStore } from "../../shared/store";
import { CheckboxSelector, PanelDropdown } from "../../shared/components";

export const SettingsPanel: FC = () => {
    const forcePolygons = useMapStore(s => s.forcePolygons);
    const showConvexHulls = useMapStore(s => s.showConvexHulls);
    const showCoords = useMapStore(s => s.showCoords);
    const showZoom = useMapStore(s => s.showZoom);

    const toggleForcePolygons = useMapStore(s => s.toggleForcePolygons);
    const toggleShowConvexHulls = useMapStore(s => s.toggleShowConvexHulls);
    const toggleShowCoords = useMapStore(s => s.toggleShowCoords);
    const toggleShowZoom = useMapStore(s => s.toggleShowZoom);
  
  return (
    <PanelDropdown panelId="settings">
      <CheckboxSelector label="Show Lat/Long" checked={showCoords} onToggle={toggleShowCoords} />
      <CheckboxSelector label="Show zoom factor" checked={showZoom} onToggle={toggleShowZoom} />
      <CheckboxSelector label="Show nations spread" checked={showConvexHulls} onToggle={toggleShowConvexHulls} />
      <CheckboxSelector label="Force community polygons" checked={forcePolygons} onToggle={toggleForcePolygons} />
    </PanelDropdown>
  
  );
};

export default SettingsPanel;
