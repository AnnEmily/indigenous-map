import { FC } from "react";

import { useMapStore } from "../../shared/store";
import { CheckboxSelector, PanelDropdown } from "../../shared/components";

export const SettingsPanel: FC = () => {
    const enableClustering = useMapStore(s => s.enableClustering);
    const forcePolygons = useMapStore(s => s.forcePolygons);
    const showConvexHulls = useMapStore(s => s.showConvexHulls);
    const showCoords = useMapStore(s => s.showCoords);
    const showZoom = useMapStore(s => s.showZoom);

    const toggleEnableClustering = useMapStore(s => s.toggleEnableClustering);
    const toggleForcePolygons = useMapStore(s => s.toggleForcePolygons);
    const toggleShowConvexHulls = useMapStore(s => s.toggleShowConvexHulls);
    const toggleShowCoords = useMapStore(s => s.toggleShowCoords);
    const toggleShowZoom = useMapStore(s => s.toggleShowZoom);
  
  return (
    <PanelDropdown panelId="settings">
      <CheckboxSelector label="Show Lat/Long" checked={showCoords} onToggle={toggleShowCoords} />
      <CheckboxSelector label="Show zoom factor" checked={showZoom} onToggle={toggleShowZoom} />
      
      <CheckboxSelector
        label="Show nations spread"
        checked={showConvexHulls}
        onToggle={toggleShowConvexHulls}
        disabled={enableClustering}
      />
      
      <CheckboxSelector
        label="Show community spread"
        checked={forcePolygons}
        onToggle={toggleForcePolygons}
        disabled={showConvexHulls}
      />

      <CheckboxSelector
        label="Group communities"
        checked={enableClustering}
        onToggle={toggleEnableClustering}
        disabled={showConvexHulls}
      />
    </PanelDropdown>
  
  );
};

export default SettingsPanel;
