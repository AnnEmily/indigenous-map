import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Nation, TileProvider } from '../types';

interface MapData {
  showCoords: boolean;
  tileSource: TileProvider;
  activeNations: Nation[];
}

interface MapActions {
  setTileSource: (_ts: TileProvider) => void;
  toggleShowCoords: () => void;
  updateActiveNations: (_nation: Nation, _add: boolean) => void;
  resetMap: () => void;
}

export type MapState = MapData & MapActions;

const initialState: MapData = {
  showCoords: false,
  tileSource: 'osm',
  activeNations: [],
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setTileSource: tileSource => set({ tileSource }),
      
      toggleShowCoords: () => set(state => ({ showCoords: !state.showCoords })),

      updateActiveNations: (nation, add) => {
        if (add) {
          set(state => ({ activeNations: [...state.activeNations, nation].sort() }));
        } else {
          set(state => ({ activeNations: state.activeNations.filter(n => n !== nation) }));
        }
      },

      resetMap: () => set({ ...initialState }),
    }),
    {
      // item name in localStorage
      name: 'map-settings-storage',

      // Only persist these specific fields on reset
      partialize: (state) => ({
        tileSource: state.tileSource,
        showCoords: state.showCoords,
      }),
    }
  )
);
