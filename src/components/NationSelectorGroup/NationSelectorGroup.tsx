import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';

import { useMapStore } from "../../shared/store";
import { nationColorMap } from "../../shared/constants";
import { Nation, NATIONS, State } from "../../shared/types";
import '../../Mapper.css';

interface NationSelectorGroupProps {
  nationStateMap: Map<Nation, State[]>;
}

export const NationSelectorGroup: FC<NationSelectorGroupProps> = ({ nationStateMap }) => {
  const { activeNations, activeStates, updateActiveNations } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    activeStates: state.activeStates,
    updateActiveNations: state.updateActiveNations,
  })));

  return (
    <div id="nation-selector-group">
      <FormControl component="fieldset">
        <FormGroup>
          {[...NATIONS].sort().map(nation => {
            const isActive = activeNations.includes(nation);
            const isEnabled = activeStates.some(state => nationStateMap.get(nation)?.includes(state));

             // Don't show nations that don't have any active states)
            if (!isEnabled) return null;

            return (
              <FormControlLabel
                key={nation}
                disabled={!isEnabled}
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
