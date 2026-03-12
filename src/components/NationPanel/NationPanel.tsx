import { FC } from "react";

import { PanelDropdown } from "../../shared/components";
import { NationSelectorGroup } from "../NationSelectorGroup";

export const NationPanel: FC = () => {
  
  return (
    <PanelDropdown panelId="nations">
      <NationSelectorGroup />
    </PanelDropdown>
  
  );
};

export default NationPanel;
