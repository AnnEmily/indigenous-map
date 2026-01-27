import { type FC } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

import { useMapStore } from "../../shared/store";
import { TileProvider } from "../../shared/types";
import '../../Mapper.css';

interface LeftMenuProps {
  id?: string;
}

export const LeftMenu: FC<LeftMenuProps> = ({ id }) => {
  const { showCoords, tileSource, setTileSource, toggleShowCoords } = useMapStore(useShallow(state => ({
    setTileSource: state.setTileSource,
    showCoords: state.showCoords,
    tileSource: state.tileSource,
    toggleShowCoords: state.toggleShowCoords,
  })));
    
  const className = clsx('left-menu');

  return (
    <div id={id} className={className}>
      <FormControlLabel
        control={
          <Checkbox checked={showCoords} onChange={toggleShowCoords} />
        } label="Show Lat/Long" />

        <FormControl>
          <FormLabel id="tile-source">{"Tile Source"}</FormLabel>
          <RadioGroup
            aria-labelledby="tile-source"
            value={tileSource}
            onChange={e => setTileSource(e.target.value as TileProvider)}
            name="radio-buttons-group"
          >
            <FormControlLabel value="osm" control={<Radio />} label="OpenStreetMap" />
            <FormControlLabel value="mbStreets" control={<Radio />} label="Mapbox - Streets" />
            <FormControlLabel value="mbOutdoors" control={<Radio />} label="Mapbox - Outdoor" />
            <FormControlLabel value="mbSatellite" control={<Radio />} label="Mapbox - Satellite" />
          </RadioGroup>
        </FormControl>
    </div>
  );
};

export default LeftMenu;
