import { FC } from "react";

import { SelectorDropdown } from "../../shared/components/SelectorDropdown";
import { StateSelectorGroup } from "../../components";

export const StatePanel: FC = () => {
  
  return (
    <SelectorDropdown title={"State Filter"} defaultOpen>
      <StateSelectorGroup />
    </SelectorDropdown>
  
  );
};

export default StatePanel;
