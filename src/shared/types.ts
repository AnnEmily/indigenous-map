export type Coords = {
  lat: number;
  long: number;
};

export const TILE_PROVIDERS = ['osm', 'mbStreets', 'mbOutdoors', 'mbDark', 'mbSatellite'] as const;
export type TileProvider = typeof TILE_PROVIDERS[number];

export const NATIONS = ['abenaki', 'micmac', 'wolastoqiyik', 'cree'] as const;
export type Nation = typeof NATIONS[number];
