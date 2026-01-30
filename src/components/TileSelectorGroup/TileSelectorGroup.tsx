import { type FC } from "react";
import clsx from "clsx";
import { useShallow } from "zustand/shallow";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { TileProvider } from "../../shared/types";
import { tileSourceNames } from "../..//shared/constants";

export const TileSelectorGroup: FC = () => {
  const { tileSource, setTileSource } = useMapStore(useShallow(state => ({
    setTileSource: state.setTileSource,
    tileSource: state.tileSource,
  })));
    
  const className = clsx('tile-provider');

  return (
    <FormControl className={className}>
      <FormLabel id="tile-source">{"Tile Source"}</FormLabel>
      <RadioGroup
        aria-labelledby="tile-source"
        value={tileSource}
        onChange={e => setTileSource(e.target.value as TileProvider)}
        name="radio-buttons-group"
      >
        {[...tileSourceNames].map(([key, label]) => (
          <FormControlLabel
            key={key}
            value={key}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default TileSelectorGroup;
