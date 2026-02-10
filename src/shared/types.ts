import { MultiPolygon, Point, Polygon } from "geojson";

export type Coords = {
  lat: number;
  long: number;
};

export const TILE_PROVIDERS = ['osm', 'mbStreets', 'mbOutdoors', 'mbDark', 'mbSatellite'] as const;
export type TileProvider = typeof TILE_PROVIDERS[number];

export const NATIONS = ['abenaki', 'innu', 'inuit', 'metis', 'micmac', 'mohawk', 'naskapi', 'wolastoqiyik', 'cree'] as const;
export type Nation = typeof NATIONS[number];

export const STATES = ['QC', 'NB', 'NL', 'NS', 'NY', 'ON', 'PE'] as const;
export type State = typeof STATES[number];

export type Shapes = Point | Polygon | MultiPolygon;

export type CommunityProperties = {
  id: number;
  nation: Nation;
  name: string;
  lot?: string;
  states: State[];
  website?: string;
  boundaries?: string[];
};
