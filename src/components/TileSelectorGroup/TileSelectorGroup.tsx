import { useMemo, useState, type FC } from "react";
import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { TileProvider } from "../../shared/types";
import { tileSourceColors, tileSourceEnable, tileSourceNames, tileSourceTypes } from "../..//shared/constants";
import { SortRectangle } from "./SortRectangle";

export const TileSelectorGroup: FC = () => {
  const tileSource = useMapStore(state => state.tileSource);
  const setTileSource = useMapStore(state => state.setTileSource);

  const [sortBy, setSortBy] = useState<'name' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleClick = (sortType: 'name' | 'type') => {
    if (sortBy === sortType) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(sortType);
    }
  };

  const sortedArray = useMemo((): Map<TileProvider, string> => {
    const filteredSources = [...tileSourceNames.entries()].filter(([key]) => tileSourceEnable.get(key));

    if (sortBy === 'name') {
      return new Map(filteredSources.sort((a, b) => sortOrder === 'asc'
        ? a[1].localeCompare(b[1])
        : b[1].localeCompare(a[1])
      ));
    } else {
      // Sort by type
      return new Map(filteredSources.sort((a, b) => sortOrder === 'asc'
        ? tileSourceTypes.get(a[0]).localeCompare(tileSourceTypes.get(b[0]))
        : tileSourceTypes.get(b[0]).localeCompare(tileSourceTypes.get(a[0]))
      ));
    }
  }, [sortOrder, sortBy]);
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px', paddingLeft: '32px', marginBottom: '5px' }}>
        <SortRectangle
          label="Sort by name"
          isActive={sortBy === 'name'}
          sortOrder={sortOrder}
          onClick={() => handleClick('name')}
          width={156}
        />
        <SortRectangle
          label="Sort by type"
          isActive={sortBy === 'type'}
          sortOrder={sortOrder}
          onClick={() => handleClick('type')}
        />
      </Box>

      <FormControl className="tile-provider">
        <RadioGroup
          aria-labelledby="tile-source"
          value={tileSource}
          onChange={e => setTileSource(e.target.value as TileProvider)}
          name="radio-buttons-group"
        >
          {[...sortedArray].map(([tileProvider, providerName]) => (
            <FormControlLabel
              key={tileProvider}
              value={tileProvider}
              control={<Radio size="small" />}
              label={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'anchor-center', width: '200px' }}>
                  <div>{providerName}</div>
                  <div style={{ border: '1px solid gray', width: '30px', height: '14px', backgroundColor: tileSourceColors.get(tileProvider) }} />
                </div>
              }
              className="selector-typography"
              sx={{
                margin: 0,
                '& .MuiButtonBase-root.MuiRadio-root' : {
                  padding: '2px',
                }
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default TileSelectorGroup;
