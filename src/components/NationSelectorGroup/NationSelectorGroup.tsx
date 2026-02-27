import { type FC } from "react";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControl, FormControlLabel, FormGroup, styled } from '@mui/material';

import { useMapStore } from "../../shared/store";
import { nationColorMap } from "../../shared/constants";
import { Nation, NATIONS, State } from "../../shared/types";
import '../../Mapper.css';

const MyCheckbox = styled(Checkbox)({
  paddingTop: '1px',
  paddingBottom: '1px',
});

interface NationSelectorGroupProps {
  nationStateMap: Map<Nation, State[]>;
}

export const NationSelectorGroup: FC<NationSelectorGroupProps> = ({ nationStateMap }) => {
  const { activeNations, activeStates, updateActiveNations } = useMapStore(useShallow(state => ({
    activeNations: state.activeNations,
    activeStates: state.activeStates,
    updateActiveNations: state.updateActiveNations,
  })));

    const allSelected = activeNations.length === NATIONS.length;
    const allUnselected = activeNations.length === 0;
  
  return (
    <div id="nation-selector-group">
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            label="All"
            control={
              <MyCheckbox
                checked={allSelected}
                indeterminate={!allSelected && !allUnselected}
                onChange={() => updateActiveNations([...NATIONS], !allSelected)}
              />
            }
          />

          {[...NATIONS].sort().map(nation => {
            const isActive = activeNations.includes(nation);
            const isEnabled = activeStates.some(state => nationStateMap.get(nation)?.includes(state));

             // Don't show nations that don't have any active states
            if (!isEnabled) return null;

            return (
              <FormControlLabel
                key={nation}
                disabled={!isEnabled}
                control={
                  <MyCheckbox
                    checked={isActive}
                    onChange={() => updateActiveNations([nation], !isActive)}
                    name={nation}
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
