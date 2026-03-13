import { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";

export type Coords = {
  lat: number;
  long: number;
};

export const PANELS = ['settings', 'tileSource', 'stateFilter', 'nations'] as const;
export type Panel = typeof PANELS[number];

export const ARCGIS = ['arcgisWorldStreet', 'arcgisWorldTopo', 'arcgisWorldImagery', 'arcgisNatGeo', 'arcgisLightGray', 'arcgisDarkGray'] as const;
export const CARTO = ['cartoDark', 'cartoVoyager'] as const;
export const MAPBOX = ['mbOutdoors', 'mbStreets', 'mbSatellite', 'mbDark'] as const;
export const OPEN_STREET_MAP = ['osm'] as const;
export const OPEN_TOPO_MAP = ['otm'] as const;
export const STAMEN = ['stamenToner', 'stamenTerrain', 'stamenWatercolor'] as const;

export const TILE_PROVIDERS = [
  ...ARCGIS,
  ...CARTO,
  ...MAPBOX,
  ...OPEN_STREET_MAP,
  ...OPEN_TOPO_MAP,
  ...STAMEN,
] as const;
export type TileProvider = typeof TILE_PROVIDERS[number];

export const NATIONS = ['abenaki', 'anishinabe', 'attikamek', 'cree', 'innu', 'inuit', 'southern_inuit', 'micmac', 'mohawk', 'naskapi', 'wendat', 'wolastoqiyik'] as const;
export type Nation = typeof NATIONS[number];

export const STATES = ['QC', 'MA', 'NB', 'NL', 'NS', 'NY', 'ON', 'PE'] as const;
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

export type NationInfo = {
  nation: Nation;
  nationNameNative: string;
  language: string[];
  territoryName: string;
  territoryArea: string;
  government: string[];
  websites: string[];
  population: string;
  formerNamesFR: string[];
  formerNamesEN: string[];
  families: string[];
};

export type GeoJson = FeatureCollection<Shapes, CommunityProperties>;
