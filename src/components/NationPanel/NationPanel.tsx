import { FC } from "react";

import { geoJson } from "../../data/data";
import { Nation, State } from "../../shared/types";
import { initialNationStates } from "../../shared/constants";

import { SelectorDropdown } from "../../shared/components";
import { NationSelectorGroup } from "../NationSelectorGroup";

const nationStateMap = new Map<Nation, State[]>(
  (() => {
    const record = geoJson.features.reduce((acc, feature) => {
      const { nation, states } = feature.properties as { nation: Nation; states: State[] };
      acc[nation] = Array.from(new Set([...acc[nation], ...states]));
      return acc;
    }, { ...initialNationStates } as Record<Nation, State[]>);

    return Object.entries(record) as [Nation, State[]][];
  })()
);

export const NationPanel: FC = () => {
  
  return (
    <SelectorDropdown title={"Indian Nations"} defaultOpen>
      <NationSelectorGroup nationStateMap={nationStateMap} />
    </SelectorDropdown>
  
  );
};

export default NationPanel;
