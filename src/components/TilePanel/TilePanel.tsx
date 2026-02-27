import { FC } from "react";

import { SelectorDropdown } from "../../shared/components/SelectorDropdown";
import { TileSelectorGroup } from "../TileSelectorGroup";

export const TilePanel: FC = () => {
  
  return (
    <SelectorDropdown panelId="tileSource">
      <TileSelectorGroup />
    </SelectorDropdown>
  
  );
};

export default TilePanel;
