import { type FC } from "react";

import '../../Mapper.css';
import { NationPanel, SettingsPanel, StatePanel, TilePanel } from "../../components";

interface LeftMenuProps {
  id?: string;
}

export const LeftMenu: FC<LeftMenuProps> = ({ id }) => {
  return (
    <div id={id} className="left-menu">
      <SettingsPanel />
      <TilePanel />
      <StatePanel />
      <NationPanel />
    </div>
  );
};

export default LeftMenu;
