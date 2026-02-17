import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Nation, NATIONS, State, STATES, TileProvider } from '../types';

interface Viewport {
  lat: number;
  lng: number;
  zoom: number;
}

interface MapData {
  activeNations: Nation[];
  activeStates: State[];
  showConvexHulls: boolean;
  showCoords: boolean;
  showZoom: boolean;
  tileSource: TileProvider;
  viewport: Viewport;
}

interface MapActions {
  setTileSource: (_ts: TileProvider) => void;
  toggleShowConvexHulls: () => void;
  toggleShowCoords: () => void;
  toggleShowZoom: () => void;
  updateActiveNations: (_nation: Nation, _add: boolean) => void;
  updateActiveStates: (_state: State, _add: boolean) => void;
  setViewport: (_v: Viewport) => void;
  resetMap: () => void;
}

export type MapState = MapData & MapActions;

const initialState: MapData = {
  showConvexHulls: false,
  showCoords: false,
  showZoom: false,
  tileSource: 'mbSatellite',
  activeNations: [...NATIONS],
  activeStates: [...STATES],
  viewport: { lat: 54, lng: -69.7, zoom: 5 }, // QC full, centered in viewport
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setTileSource: tileSource => set({ tileSource }),
      
      setViewport: (viewport) => set({ viewport }),

      toggleShowConvexHulls: () => set(state => ({ showConvexHulls: !state.showConvexHulls })),

      toggleShowCoords: () => set(state => ({ showCoords: !state.showCoords })),

      toggleShowZoom: () => set(state => ({ showZoom: !state.showZoom })),

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
        showZoom: state.showZoom,
        viewport: state.viewport,
      }),
    }
  )
);
