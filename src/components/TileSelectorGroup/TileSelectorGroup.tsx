import { useMemo, type FC } from "react";
import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";
import { TileProvider, TileSortBy } from "../../shared/types";
import { tileSourceColors, tileSourceEnable, tileSourceNames, tileSourceTypes } from "../..//shared/constants";
import { SortRectangle } from "./SortRectangle";

export const TileSelectorGroup: FC = () => {
  const setTileSource = useMapStore(state => state.setTileSource);
  const toggleTileSortBy = useMapStore(state => state.toggleTileSortBy);
  const toggleTileSortOrder = useMapStore(state => state.toggleTileSortOrder);
  const tileSortBy = useMapStore(state => state.tileSortBy);
  const tileSortOrder = useMapStore(state => state.tileSortOrder);
  const tileSource = useMapStore(state => state.tileSource);

  const handleClick = (sortBy: TileSortBy) => {
    if (tileSortBy === sortBy) {
      // User clicked on the column header that leads the sort: revert sort order
      toggleTileSortOrder();
    } else {
      // User clicked on the other column
      toggleTileSortBy();
    }
  };

  const sortedArray = useMemo((): Map<TileProvider, string> => {
    const filteredSources = [...tileSourceNames.entries()].filter(([key]) => tileSourceEnable.get(key));

    if (tileSortBy === 'name') {
      return new Map(filteredSources.sort((a, b) => tileSortOrder === 'asc'
        ? a[1].localeCompare(b[1])
        : b[1].localeCompare(a[1])
      ));
    } else {
      // Sort by type
      return new Map(filteredSources.sort((a, b) => tileSortOrder === 'asc'
        ? tileSourceTypes.get(a[0]).localeCompare(tileSourceTypes.get(b[0]))
        : tileSourceTypes.get(b[0]).localeCompare(tileSourceTypes.get(a[0]))
      ));
    }
  }, [tileSortOrder, tileSortBy]);
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '200px', paddingLeft: '32px', marginBottom: '5px' }}>
        <SortRectangle
          label="Sort by name"
          isActive={tileSortBy === 'name'}
          sortOrder={tileSortOrder}
          onClick={() => handleClick('name')}
          width={156}
        />
        <SortRectangle
          label="Sort by type"
          isActive={tileSortBy === 'type'}
          sortOrder={tileSortOrder}
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
