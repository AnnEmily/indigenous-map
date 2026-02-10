import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';

import { nationColorMap } from "../../shared/constants";
import { useMapStore } from "../../shared/store";
import { NATIONS } from "../../shared/types";
import '../../Mapper.css';

export const NationSelectorGroup: FC = () => {
  const { activeNations, updateActiveNations } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    updateActiveNations: state.updateActiveNations,
  })));

  return (
    <div id="nation-selector-group">
      <FormControl component="fieldset">
        <FormGroup>
          {[...NATIONS].sort().map(nation => {
            const isActive = activeNations.includes(nation);
            return (
              <FormControlLabel key={nation}
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={() => updateActiveNations(nation, !isActive)}
                    name={nation}
                    sx={{ paddingTop: '1px', paddingBottom: '1px' }}
                  />
                }
                label={nation.charAt(0).toUpperCase() + nation.slice(1)}
                className="selector-typography"
                sx={{ '& .MuiTypography-root' : { background: nationColorMap.get(nation) } }}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default NationSelectorGroup;
