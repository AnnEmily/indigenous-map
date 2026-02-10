import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControlLabel } from '@mui/material';

import '../../Mapper.css';
import { useMapStore } from "../../shared/store";

export const ShowCoordsSelector: FC = () => {
  const { showCoords, toggleShowCoords } = useMapStore(useShallow(state => ({
    showCoords: state.showCoords,
    toggleShowCoords: state.toggleShowCoords,
  })));

  return (
    <FormControlLabel
      control={
        <Checkbox checked={showCoords} onChange={toggleShowCoords} size="small"/>
      }
      label="Show Lat/Long"
      className="selector-typography"
      sx={{
        margin: 0,
        '& .MuiButtonBase-root.MuiCheckbox-root' : {
          padding: '4px',
        }
      }}
    />
  );
};

export default ShowCoordsSelector;
