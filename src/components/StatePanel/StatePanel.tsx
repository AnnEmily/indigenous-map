import { FC } from "react";

import { PanelDropdown } from "../../shared/components";
import { StateSelectorGroup } from "../../components";

export const StatePanel: FC = () => {
  
  return (
    <PanelDropdown panelId="stateFilter">
      <StateSelectorGroup />
    </PanelDropdown>
  
  );
};

export default StatePanel;
