import { FC } from "react";
import { SelectorDropdown } from "../SelectorDropdown";
import { TileSelectorGroup } from "../TileSelectorGroup";

export const TilePanel: FC = () => {
  
  return (
    <SelectorDropdown title={"Map Source"} defaultOpen>
      <TileSelectorGroup />
    </SelectorDropdown>
  
  );
};

export default TilePanel;
