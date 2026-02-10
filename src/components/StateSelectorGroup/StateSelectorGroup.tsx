import { type FC } from "react";
import { sortBy } from "lodash";
import { useShallow } from "zustand/shallow";
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material';

import { useMapStore } from "../../shared/store";
import { stateNameMap } from "../../shared/constants";
import '../../Mapper.css';

export const StateSelectorGroup: FC = () => {
  const { activeStates, updateActiveStates } = useMapStore(useShallow(state => ({
    activeStates: state.activeStates,
    updateActiveStates: state.updateActiveStates,
  })));

  return (
    <div id="state-selector-group">
      <FormControl component="fieldset">
        <FormGroup>
          {sortBy([...stateNameMap], ([_, fullName]) => fullName).map(([acronym, fullName]) => {
            const isActive = activeStates.includes(acronym);
            return (
              <FormControlLabel key={acronym}
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={() => updateActiveStates(acronym, !isActive)}
                    name={acronym}
                    sx={{ paddingTop: '1px', paddingBottom: '1px' }}
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
