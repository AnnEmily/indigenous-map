import { type FC } from "react";
import { sortBy } from "lodash";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControl, FormControlLabel, FormGroup, styled } from '@mui/material';

import { useMapStore } from "../../shared/store";
import { STATES } from "../../shared/types";
import { stateNameMap } from "../../shared/constants";
import '../../Mapper.css';

const MyCheckbox = styled(Checkbox)({
  paddingTop: '1px',
  paddingBottom: '1px',
});

export const StateSelectorGroup: FC = () => {
  const { activeStates, updateActiveStates } = useMapStore(useShallow(state => ({
    activeStates: state.activeStates,
    updateActiveStates: state.updateActiveStates,
  })));

  const allSelected = activeStates.length === STATES.length;
  const allUnselected = activeStates.length === 0;

  return (
    <div id="state-selector-group">
      <FormControl component="fieldset">
        <FormGroup>
          <FormControlLabel
            label="All"
            control={
              <MyCheckbox
                checked={allSelected}
                indeterminate={!allSelected && !allUnselected}
                onChange={() => updateActiveStates([...STATES], !allSelected)}
              />
            }
          />
          
          {sortBy([...stateNameMap], ([_, fullName]) => fullName).map(([acronym, fullName]) => {
            const isActive = activeStates.includes(acronym);
            return (
              <FormControlLabel key={acronym}
                control={
                  <MyCheckbox
                    checked={isActive}
                    onChange={() => updateActiveStates([acronym], !isActive)}
                    name={acronym}
                  />
                }
                label={fullName}
                className="selector-typography"
                sx={{ '& .MuiTypography-root' : { paddingInline: 0 } }}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default StateSelectorGroup;
