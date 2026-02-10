import { type FC } from "react";
import clsx from "clsx";

import '../../Mapper.css';
import { ShowCoordsSelector } from "../ShowCoordsSelector";
import { NationPanel } from "../NationPanel";
import TilePanel from "../TilePanel/TilePanel";

interface LeftMenuProps {
  id?: string;
}

export const LeftMenu: FC<LeftMenuProps> = ({ id }) => {
  const className = clsx('left-menu');

  return (
    <div id={id} className={className}>
        <ShowCoordsSelector />
        <TilePanel />
        <NationPanel />
    </div>
  );
};

export default LeftMenu;
