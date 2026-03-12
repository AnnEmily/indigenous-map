import { create } from 'zustand';

import { GeoJson, Nation, NATIONS, State, STATES } from '../types';

// AEG
// type StateCommunities = {
//   state: State;
//   comm: string[];
// }

export interface DataFields {
  // communitiesStatesByNation: { nation: Nation; stateCommunities: StateCommunities }[];
  // communitiesStatesByNation: Map<Nation, StateCommunities[]>;
  communitiesStatesByNation: Map<Nation, Map<State, string[]>>;

  communityCountByNation: Map<Nation, number>;
  communityCountByState: Map<State, number>;
  nationsByState: Map<State, Nation[]>;
  nationCountByState: Map<State, number>;
  statesByNation: Map<Nation, State[]>;
}

interface DataActions {
  setData: (_data: Partial<DataFields>) => void;
  resetData: () => void;
}

export type DataState = DataFields & DataActions;

const initialState: DataFields = {
  communitiesStatesByNation: new Map<Nation, Map<State, string[]>>(
    NATIONS.map(nation => [
      nation,
      new Map<State, string[]>(
        STATES.map(state => [state, []] as [State, string[]])
      )
    ])
  ),
  communityCountByNation: new Map<Nation, number>(
    NATIONS.map(nation => [nation, 0] as [Nation, number])
  ),
  communityCountByState: new Map<State, number>(
    STATES.map(state => [state, 0] as [State, number])
  ),
  nationsByState: new Map<State, Nation[]>(
    STATES.map(state => [state, []] as [State, Nation[]])
  ),
  nationCountByState: new Map<State, number>(
    STATES.map(state => [state, 0] as [State, number])
  ),
  statesByNation: new Map<Nation, State[]>(
    NATIONS.map(nation => [nation, []] as [Nation, State[]])
  )
};

export const useDataStore = create<DataState>()(
  (set) => ({
    ...initialState,

    setData: (data) => set(data),
    resetData: () => set(() => ({ ...initialState })),
  })
);

export const getGroupingStats = (geoJson: GeoJson): Partial<DataFields> => {
  // Need the Maps to be initialized
  const {
    communitiesStatesByNation,
    communityCountByNation,
    communityCountByState,
    nationsByState,
    nationCountByState,
    statesByNation,
  } = initialState;

  geoJson.features.forEach(feature => {
    const { name, nation, states } = feature.properties;
    communityCountByNation.set(nation, communityCountByNation.get(nation)! + 1);

    const communitiesByState = communitiesStatesByNation.get(nation);
    
    states.forEach(state => {
      const communities = communitiesByState.get(state);
      const uniqCommunities = [...new Set([...communities, name])];
      communitiesByState.set(state, uniqCommunities.sort());
    });
    communitiesStatesByNation.set(nation, communitiesByState);

    states.forEach(state => {
      communityCountByState.set(state, communityCountByState.get(state)! + 1);
      const nationsInState = [...nationsByState.get(state), nation];
      nationsByState.set(state, [...new Set(nationsInState)]);
    });
  });

  STATES.forEach(state => {
    nationCountByState.set(state, nationsByState.get(state).length);
  });

  const arrayOfObjects = Array.from(nationsByState, ([state, nations]) => ({ state, nations }));

  NATIONS.forEach(nation => {
    const states = arrayOfObjects.filter(entry => entry.nations.includes(nation)).map(entry => entry.state);
    statesByNation.set(nation, states);
  });

  console.log('communityCountByNation', communityCountByNation);
  console.log('communityCountByState', communityCountByState);
  console.log('nationsByState', nationsByState);
  console.log('statesByNation', statesByNation);
  console.log('nationCountByState', nationCountByState);
  console.log('communitiesStatesByNation', communitiesStatesByNation);
  
  return {
    communityCountByNation,
    communityCountByState,
    nationsByState,
    nationCountByState,
    statesByNation,
  };
};
