import { type FC } from "react";
import clsx from "clsx";

import '../../Mapper.css';
import { NationSelectorGroup } from "../NationSelectorGroup";
import { TileSelectorGroup } from "../TileSelectorGroup";
import { ShowCoordsSelector } from "../ShowCoordsSelector";

interface LeftMenuProps {
  id?: string;
}

export const LeftMenu: FC<LeftMenuProps> = ({ id }) => {
  const className = clsx('left-menu');

  return (
    <div id={id} className={className}>
        <ShowCoordsSelector />
        <TileSelectorGroup />
        <NationSelectorGroup />
    </div>
  );
};

export default LeftMenu;
