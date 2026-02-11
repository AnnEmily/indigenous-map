import { FC } from "react";
import { useShallow } from "zustand/shallow";

import { useMapStore } from "../../shared/store";
import { CheckboxSelector, SelectorDropdown } from "../../shared/components";

export const SettingsPanel: FC = () => {
    const { showCoords, showZoom, toggleShowCoords, toggleShowZooom } = useMapStore(useShallow(state => ({
      showCoords: state.showCoords,
      showZoom: state.showZoom,
      toggleShowCoords: state.toggleShowCoords,
      toggleShowZooom: state.toggleShowZoom,
    })));
  
  return (
    <SelectorDropdown title={"Settings"} defaultOpen>
      <CheckboxSelector label="Show Lat/Long" checked={showCoords} onToggle={toggleShowCoords} />
      <CheckboxSelector label="Show zoom factor" checked={showZoom} onToggle={toggleShowZooom} />
    </SelectorDropdown>
  
  );
};

export default SettingsPanel;
