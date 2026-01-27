export type Coords = {
  lat: number;
  long: number;
};

export const TILE_PROVIDERS = ['osm', 'mbStreets', 'mbOutdoors', 'mbSatellite'] as const;
export type TileProvider = typeof TILE_PROVIDERS[number];
