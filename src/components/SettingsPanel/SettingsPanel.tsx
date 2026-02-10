import { FC } from "react";

import { SelectorDropdown } from "../../shared/components/SelectorDropdown";
import { ShowCoordsSelector } from "../ShowCoordsSelector";

export const SettingsPanel: FC = () => {
  
  return (
    <SelectorDropdown title={"Settings"} defaultOpen>
      <ShowCoordsSelector />
    </SelectorDropdown>
  
  );
};

export default SettingsPanel;
