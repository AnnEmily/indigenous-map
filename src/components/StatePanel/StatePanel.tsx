import { FC } from "react";

import { SelectorDropdown } from "../../shared/components/SelectorDropdown";
import { StateSelectorGroup } from "../../components";

export const StatePanel: FC = () => {
  
  return (
    <SelectorDropdown panelId="stateFilter">
      <StateSelectorGroup />
    </SelectorDropdown>
  
  );
};

export default StatePanel;
