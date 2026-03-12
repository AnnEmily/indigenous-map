import { type FC } from "react";

import '../../Mapper.css';
import { geoJson } from "../../data/geoJson";
import { NationPanel, SettingsPanel, StatePanel, TilePanel } from "../../components";
import { getGroupingStats, useDataStore } from "../../shared/store";

export const LeftMenu: FC = () => {
  const setData =  useDataStore(state => state.setData);
  const groupingStats = getGroupingStats(geoJson);
  setData(groupingStats);
  
  return (
    <div id="left-menu" className="left-menu" aria-label="Main menu">
      <SettingsPanel />
      <TilePanel />
      <StatePanel />
      <NationPanel />
    </div>
  );
};

export default LeftMenu;
