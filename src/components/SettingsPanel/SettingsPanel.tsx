import { FC } from "react";
import { useShallow } from "zustand/shallow";

import { useMapStore } from "../../shared/store";
import { CheckboxSelector, SelectorDropdown } from "../../shared/components";

export const SettingsPanel: FC = () => {
    const state = useMapStore(useShallow(state => ({
      showCoords: state.showCoords,
      showZoom: state.showZoom,
      viewport: state.viewport,
      toggleShowCoords: state.toggleShowCoords,
      toggleShowZooom: state.toggleShowZoom,
    })));
  
  return (
    <SelectorDropdown title={"Settings"} defaultOpen>
      <CheckboxSelector label="Show Lat/Long" checked={state.showCoords} onToggle={state.toggleShowCoords} />
      <CheckboxSelector label="Show zoom factor" checked={state.showZoom} onToggle={state.toggleShowZooom} />
    </SelectorDropdown>
  
  );
};

export default SettingsPanel;
