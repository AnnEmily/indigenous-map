import { create } from 'zustand';
import { TileProvider } from '../types';

interface MapState {
  showCoords: boolean;
  tileSource: TileProvider;

  setTileSource: (_ts: TileProvider)  => void;
  toggleShowCoords: () => void;
  resetSolver: () => void;
}

export const useMapStore = create<MapState>(set => ({
  // Initial values
  showCoords: false,
  tileSource: 'osm',

  // Actions
  setTileSource: tileSource => set({ tileSource }),
  toggleShowCoords: () => set(state => ({ showCoords: !state.showCoords })),

  resetSolver: () => set({
    showCoords: false,
   }),
}));
