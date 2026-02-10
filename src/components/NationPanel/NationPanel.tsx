import { FC } from "react";
import { SelectorDropdown } from "../SelectorDropdown";
import { NationSelectorGroup } from "../NationSelectorGroup";

export const NationPanel: FC = () => {
  
  return (
    <SelectorDropdown title={"Indian Nations"} defaultOpen>
      <NationSelectorGroup />
    </SelectorDropdown>
  
  );
};

export default NationPanel;
