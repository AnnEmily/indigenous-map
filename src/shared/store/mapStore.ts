import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Nation, State, STATES, TileProvider } from '../types';

interface Viewport {
  lat: number;
  lng: number;
  zoom: number;
}

interface MapData {
  showCoords: boolean;
  tileSource: TileProvider;
  activeNations: Nation[];
  activeStates: State[];
  viewport: Viewport;
}

interface MapActions {
  setTileSource: (_ts: TileProvider) => void;
  toggleShowCoords: () => void;
  updateActiveNations: (_nation: Nation, _add: boolean) => void;
  updateActiveStates: (_state: State, _add: boolean) => void;
  setViewport: (_v: Viewport) => void;
  resetMap: () => void;
}

export type MapState = MapData & MapActions;

const initialState: MapData = {
  showCoords: false,
  tileSource: 'osm',
  activeNations: [],
  activeStates: [...STATES],
  viewport: { lat: 54, lng: -69.7, zoom: 5 }, // QC full, centered in viewport
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setTileSource: tileSource => set({ tileSource }),
      
      setViewport: (viewport) => set({ viewport }),

      toggleShowCoords: () => set(state => ({ showCoords: !state.showCoords })),

      updateActiveNations: (nation, add) => {
        if (add) {
          set(state => ({ activeNations: [...state.activeNations, nation].sort() }));
        } else {
          set(state => ({ activeNations: state.activeNations.filter(n => n !== nation) }));
        }
      },

      updateActiveStates: (province, add) => {
        if (add) {
          set(state => ({ activeStates: [...state.activeStates, province].sort() }));
        } else {
          set(state => ({ activeStates: state.activeStates.filter(n => n !== province) }));
        }
      },

      resetMap: () => set(state => ({ ...initialState, viewport: state.viewport })),
    }),
    {
      // item name in localStorage
      name: 'map-settings-storage',

      // Only persist these specific fields on reset
      partialize: (state) => ({
        tileSource: state.tileSource,
        showCoords: state.showCoords,
        viewport: state.viewport,
      }),
    }
  )
);
