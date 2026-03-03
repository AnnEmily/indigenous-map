import { Nation, Panel, State, TileProvider } from "./types";

// Minimum area in pixels to display a polygon instead of a pin on the map
export const MIN_PIXEL_AREA = 2000;
// Clustering parameters
export const DISABLE_CLUSTERING_AT_ZOOM = 6;
export const MAX_CLUSTER_RADIUS = 45;

const panelLabels: Record<Panel, string> = {
  settings: 'Settings',
  tileSource: 'Map Source',
  stateFilter: 'State Filter',
  nations: 'Indigenous Nations',
};

export const panelNames = new Map<Panel, string>(
  Object.entries(panelLabels) as [Panel, string][]
);

const providerIdMapping: Record<TileProvider, string> = {
  mbOutdoors: 'mapbox/outdoors-v11',
  mbStreets: 'mapbox/streets-v11',
  mbSatellite: 'mapbox/satellite-v9',
  mbDark: 'mapbox/dark-v10',
  osm: '', // Obligatoire pour satisfaire le Record
};

export const mapboxIds = new Map<TileProvider, string>(
  Object.entries(providerIdMapping) as [TileProvider, string][]
);

const tileProviderLabels: Record<TileProvider, string> = {
  osm: 'OpenStreetMap',
  mbOutdoors: 'Mapbox - Outdoors',
  mbStreets: 'Mapbox - Streets',
  mbSatellite: 'Mapbox - Satellite',
  mbDark: 'Mapbox - Dark',
};

export const tileSourceNames = new Map<TileProvider, string>(
  Object.entries(tileProviderLabels) as [TileProvider, string][]
);

const nationColors: Record<Nation, string> = {
  abenaki: '#b77739',
  anishinabe: '#e64c6d',
  attikamek: '#e681fa',
  cree: '#207e3c',
  innu: '#7a69d3',
  inuit: '#7dcff5',
  southern_inuit: '#ec24f3',
  micmac: '#f36f24',
  mohawk: '#00b1ea',
  naskapi: '#5EB04C',
  wendat: '#c44444',
  wolastoqiyik: '#b79f00',
};

export const nationColorMap = new Map<Nation, string>(
  Object.entries(nationColors) as [Nation, string][]
);

const stateLabels: Record<State, string> = {
  MA: 'Maine',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NS: 'Nova Scotia',
  NY: 'New York',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Québec',
};

export const stateNameMap = new Map<State, string>(
  Object.entries(stateLabels) as [State, string][]
);

// Below is to make sure we have an exhaustive list
// to compute the nationStateMap later on
export const initialNationStates: Record<Nation, State[]> = {
  abenaki: [],
  anishinabe: [],
  attikamek: [],
  cree: [],
  innu: [],
  inuit: [],
  southern_inuit: [],
  micmac: [],
  mohawk: [],
  naskapi: [],
  wendat: [],
  wolastoqiyik: [],
};
