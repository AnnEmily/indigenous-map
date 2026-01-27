import { type FC } from "react";
import clsx from "clsx";

import { useTheme } from "./shared/theme/useTheme";
import { LeftMenu, MapWrapper } from "./components";
import './Mapper.css';

export const Mapper: FC = () => {
  const { theme } = useTheme();
  const className = clsx('mapper', theme);

  return (
    <div id="mapper" className={className}>
      <LeftMenu />
      <MapWrapper />
    </div>
  );
};

export default Mapper;
