import { FC } from "react";
import { useShallow } from "zustand/shallow";

import { useMapStore } from "../../shared/store";
import { CheckboxSelector, SelectorDropdown } from "../../shared/components";

export const SettingsPanel: FC = () => {
    const state = useMapStore(useShallow(state => ({
      showConvexHulls: state.showConvexHulls,
      showCoords: state.showCoords,
      showZoom: state.showZoom,
      viewport: state.viewport,
      toggleShowConvexHulls: state.toggleShowConvexHulls,
      toggleShowCoords: state.toggleShowCoords,
      toggleShowZooom: state.toggleShowZoom,
    })));
  
  return (
    <SelectorDropdown panelId="settings">
      <CheckboxSelector label="Show Lat/Long" checked={state.showCoords} onToggle={state.toggleShowCoords} />
      <CheckboxSelector label="Show zoom factor" checked={state.showZoom} onToggle={state.toggleShowZooom} />
      <CheckboxSelector label="Show areas" checked={state.showConvexHulls} onToggle={state.toggleShowConvexHulls} />
    </SelectorDropdown>
  
  );
};

export default SettingsPanel;
