import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Nation, NATIONS, Panel, SortOrder, State, STATES, TileProvider, TileSortBy } from '../types';

interface Viewport {
  lat: number;
  lng: number;
  zoom: number;
}

interface MapData {
  activeNations: Nation[];
  activeStates: State[];
  enableClustering: boolean;
  openPanels: Panel[];
  forcePolygons: boolean;
  showConvexHulls: boolean;
  showCoords: boolean;
  showScale: boolean;
  showZoom: boolean;
  tileSortBy: TileSortBy;
  tileSortOrder: SortOrder;
  tileSource: TileProvider;
  viewport: Viewport;
}

interface MapActions {
  resetMap: () => void;
  setTileSource: (_ts: TileProvider) => void;
  setViewport: (_v: Viewport) => void;
  toggleEnableClustering: () => void;
  toggleForcePolygons: () => void;
  toggleShowConvexHulls: () => void;
  toggleShowCoords: () => void;
  toggleShowScale: () => void;
  toggleShowZoom: () => void;
  toggleTileSortBy: () => void;
  toggleTileSortOrder: () => void;
  updateActiveNations: (_nation: Nation[], _add: boolean) => void;
  updateActiveStates: (_state: State[], _add: boolean) => void;
  updateOpenedPanels: (_panel: Panel, _open: boolean) => void;
}

export type MapState = MapData & MapActions;

const initialState: MapData = {
  activeNations: [...NATIONS],
  activeStates: [...STATES],
  enableClustering: true,
  forcePolygons: false,
  openPanels: ['nations', 'stateFilter', 'tileSource'],
  showConvexHulls: false,
  showCoords: false,
  showScale: true,
  showZoom: false,
  tileSortBy: 'name',
  tileSortOrder: 'asc',
  tileSource: 'mbSatellite',
  viewport: { lat: 54, lng: -69.7, zoom: 5 }, // QC full, centered in viewport
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setTileSource: tileSource => set({ tileSource }),
      
      setViewport: (viewport) => set({ viewport }),

      toggleEnableClustering: () => set(state => ({ enableClustering: !state.enableClustering })),

      toggleShowConvexHulls: () => set(state => ({ showConvexHulls: !state.showConvexHulls })),

      toggleForcePolygons: () => set(state => ({ forcePolygons: !state.forcePolygons })),

      toggleShowCoords: () => set(state => ({ showCoords: !state.showCoords })),

      toggleShowScale: () => set(state => ({ showScale: !state.showScale })),

      toggleShowZoom: () => set(state => ({ showZoom: !state.showZoom })),

      toggleTileSortBy: () => set((state) => ({ tileSortBy: state.tileSortBy === 'name' ? 'type' : 'name' })),

      toggleTileSortOrder: () => set((state) => ({ tileSortOrder: state.tileSortOrder === 'asc' ? 'desc' : 'asc' })),

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

      // Version of the persisted data (not the same as app version)
      version: 2,

      // Migrate new fields to be persisted. Otherwise, they are not added to an existing localStorage
      migrate: (persistedState: Partial<MapData>, version: number) => {
        if (version < 1) {
          return {
            ...persistedState,
            tileSortBy: initialState.tileSortBy,
            tileSortOrder: initialState.tileSortOrder,
          };
        } else if (version < 2) {
          return {
            ...persistedState,
            showScale: initialState.showScale,
          };
        }

        return persistedState;
      },

      // Only persist these specific fields across sessions
      partialize: (state) => ({
        enableClustering: state.enableClustering,
        openPanels: state.openPanels,
        tileSortBy: state.tileSortBy,
        tileSortOrder: state.tileSortOrder,
        tileSource: state.tileSource,
        showCoords: state.showCoords,
        showScale: state.showScale,
        showZoom: state.showZoom,
        viewport: state.viewport,
      }),
    }
  )
);
