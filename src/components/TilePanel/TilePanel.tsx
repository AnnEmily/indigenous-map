import { FC } from "react";

import { PanelDropdown } from "../../shared/components/PanelDropdown";
import { TileSelectorGroup } from "../TileSelectorGroup";

export const TilePanel: FC = () => {
  
  return (
    <PanelDropdown panelId="tileSource">
      <TileSelectorGroup />
    </PanelDropdown>
  
  );
};

export default TilePanel;
