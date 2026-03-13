import { useMemo, type FC } from "react";
import { intersection } from "lodash";
import { FormControl, FormGroup } from '@mui/material';

import '../../Mapper.css';
import { useDataStore, useMapStore } from "../../shared/store";
import { nationColorMap } from "../../shared/constants";
import { Nation, NATIONS } from "../../shared/types";
import SelectorEntry from "./SelectorEntry";

export const NationSelectorGroup: FC = () => {
  const communitiesStatesByNation = useDataStore(state => state.communitiesStatesByNation);
  const statesByNation = useDataStore(state => state.statesByNation);
  const activeNations = useMapStore(s => s.activeNations);
  const activeStates = useMapStore(s => s.activeStates);
  const updateActiveNations = useMapStore(s => s.updateActiveNations);

  const formatNationName = (value: string): string => {
    return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get visible nations of visible provinces/states
  const allowedNations = useMemo((): Nation[] => {
    return NATIONS
      .filter(nation => intersection(statesByNation.get(nation), activeStates).length > 0 )
      .sort();
  }, [statesByNation, activeStates]);
  
  const nationNames = useMemo((): Map<Nation, string> => {
    return new Map<Nation, string>(
      Object.values(allowedNations).map((value) => [ value as Nation, formatNationName(value)])
    );
  }, [allowedNations]);

  const allSelected = allowedNations.every(nation => activeNations.includes(nation));
  const allUnselected = allowedNations.every(nation => !activeNations.includes(nation));
  
  console.log('activeNations  = ' + activeNations);
  console.log('allowedNations = ' + allowedNations);

  // Get community count for each nation of visible provinces/states
  const commCountByNation = useMemo((): Map<Nation, number> => {
    const countMap = new Map<Nation, number>();

    for (const [nation, stateToCount] of communitiesStatesByNation) {
      if (allowedNations.includes(nation) && activeNations.includes(nation)) {
        const uniqueCommunities = new Set<string>();

        for (const [state, communityList] of stateToCount) {
          if (activeStates.includes(state)) {
            communityList.forEach(c => uniqueCommunities.add(c));
          }
        }
        countMap.set(nation, uniqueCommunities.size);
      }
    }

    return countMap;
  }, [activeStates, activeNations, allowedNations, communitiesStatesByNation]);

  // Get total count of communities
  const totalCommunities = Array.from(commCountByNation.values()).reduce((a, b) => a + b, 0);

  return (
    <div id="nation-selector-group">
      <FormControl component="fieldset">
        <FormGroup sx={{ width: '200px' }}>
          <SelectorEntry
            label={"All Nations"}
            isChecked={allSelected}
            indeterminate={!allSelected && !allUnselected}
            onToggle={() => updateActiveNations([...NATIONS], !allSelected)}
            communityCount={totalCommunities}
            bgColor={'#969696'}
          />

          {allowedNations.map(nation => {
            const isActive = activeNations.includes(nation);
            const commCount = isActive ? commCountByNation.get(nation) : 0;
            const bgColor = nationColorMap.get(nation);

            return (
              <SelectorEntry
                key={nation}
                label={nationNames.get(nation)}
                isChecked={isActive}
                onToggle={() => updateActiveNations([nation], !isActive)}
                communityCount={commCount}
                bgColor={bgColor}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default NationSelectorGroup;
