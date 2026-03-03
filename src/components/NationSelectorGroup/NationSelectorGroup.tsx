import { type FC } from "react";
import { intersection } from "lodash";
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

  const formatNationName = (value: string): string => {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get nations of visible provinces/states
  const allowedNations = NATIONS.filter(nation => intersection(nationStateMap.get(nation), activeStates).length > 0 );
  const nationNames = new Map<Nation, string>(
    Object.values(allowedNations).map((value) => [ value as Nation, formatNationName(value)])
  );

  const allSelected = allowedNations.every(nation => activeNations.includes(nation));
  const allUnselected = allowedNations.every(nation => !activeNations.includes(nation));
  
  // console.log('activeNations  = ' + activeNations);
  // console.log('allowedNations = ' + allowedNations);
  // console.log('allSelected    = ' + allSelected);
  // console.log('allUnselected  = ' + allUnselected);

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

          {allowedNations.sort().map(nation => {
            const isActive = activeNations.includes(nation);

            return (
              <FormControlLabel
                key={nation}
                control={
                  <MyCheckbox
                    checked={isActive}
                    onChange={() => updateActiveNations([nation], !isActive)}
                    name={nation}
                  />
                }
                label={nationNames.get(nation)}
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
