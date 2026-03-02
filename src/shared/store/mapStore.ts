import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Nation, NATIONS, Panel, State, STATES, TileProvider } from '../types';

interface Viewport {
  lat: number;
  lng: number;
  zoom: number;
}

interface MapData {
  activeNations: Nation[];
  activeStates: State[];
  openPanels: Panel[];
  polygonThreshold: number; // Minimum area in pixels to display a polygon instead of a pin on the map
  showConvexHulls: boolean;
  showCoords: boolean;
  showZoom: boolean;
  tileSource: TileProvider;
  viewport: Viewport;
}

interface MapActions {
  setPolygonThreshold: (_pixArea: number) => void;
  setTileSource: (_ts: TileProvider) => void;
  toggleShowConvexHulls: () => void;
  toggleShowCoords: () => void;
  toggleShowZoom: () => void;
  updateActiveNations: (_nation: Nation[], _add: boolean) => void;
  updateActiveStates: (_state: State[], _add: boolean) => void;
  updateOpenedPanels: (_panel: Panel, _open: boolean) => void;
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
  openPanels: ['nations', 'stateFilter', 'tileSource'],
  polygonThreshold: 2000,
  viewport: { lat: 54, lng: -69.7, zoom: 5 }, // QC full, centered in viewport
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setPolygonThreshold: pixArea => set(({ polygonThreshold: pixArea })),

      setTileSource: tileSource => set({ tileSource }),
      
      setViewport: (viewport) => set({ viewport }),

      toggleShowConvexHulls: () => set(state => ({ showConvexHulls: !state.showConvexHulls })),

      toggleShowCoords: () => set(state => ({ showCoords: !state.showCoords })),

      toggleShowZoom: () => set(state => ({ showZoom: !state.showZoom })),

      updateActiveNations: (nations, add) => {
        if (add) {
          set(state => ({ activeNations: [...new Set([...state.activeNations, ...nations])].sort() }));
        } else {
          set(state => ({ activeNations: state.activeNations.filter(n => !nations.includes(n)) }));
        }
      },

      updateActiveStates: (provinces, add) => {
        if (add) {
          set(state => ({ activeStates: [...new Set([...state.activeStates, ...provinces])].sort() }));
        } else {
          set(state => ({ activeStates: state.activeStates.filter(s => !provinces.includes(s)) }));
        }
      },

      updateOpenedPanels: (panel, open) => {
        if (open) {
          set(state => ({ openPanels: [...state.openPanels, panel] }));
        } else {
          set(state => ({ openPanels: state.openPanels.filter(p => p !== panel) }));
        }
      },

      resetMap: () => set(state => ({ ...initialState, viewport: state.viewport })),
    }),
    {
      // item name in localStorage
      name: 'map-settings-storage',

      // Only persist these specific fields on reset
      partialize: (state) => ({
        openPanels: state.openPanels,
        tileSource: state.tileSource,
        showCoords: state.showCoords,
        showZoom: state.showZoom,
        viewport: state.viewport,
      }),
    }
  )
);
