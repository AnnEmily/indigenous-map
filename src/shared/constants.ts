import { Nation, Panel, State, TileProvider, TileProviderOptions } from "./types";

// Minimum area in pixels to display a polygon instead of a pin on the map
export const MIN_PIXEL_AREA = 2000;
// Clustering parameters
export const DISABLE_CLUSTERING_AT_ZOOM = 6;
export const MAX_CLUSTER_RADIUS = 45;

const panelLabels: Record<Panel, string> = {
  settings: 'Display Settings',
  tileSource: 'Map Source',
  stateFilter: 'Province Filter',
  nations: 'Indigenous Nations',
};

export const panelNames = new Map<Panel, string>(
  Object.entries(panelLabels) as [Panel, string][]
);

const token = import.meta.env.VITE_MAPBOX_TOKEN;

export const providerConfigs: Record<TileProvider, TileProviderOptions> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap',
    maxZoom: 19
  },
  otm: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap',
    maxZoom: 17
  },
  cartoDark: {
    url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20,
    subdomains: 'abcd'
  },
  cartoVoyager: {
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20,
    subdomains: 'abcd'
  },
  // stamenToner: {
  //   url: `https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png`,
  //   attribution: 'Map tiles by Stamen Design, hosted by Stadia Maps. Data © OpenStreetMap contributors',
  //   maxZoom: 18
  // },
  stamenDark: {
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png`,
    attribution: 'Map tiles by Stamen Design, hosted by Stadia Maps. Data © OpenStreetMap contributors',
    maxZoom: 18,
    tileClassName: 'tiles-dark-enhanced',
  },
  stamenTerrain: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png`,
    attribution: 'Map tiles by Stamen Design, hosted by Stadia Maps. Data © OpenStreetMap contributors',
    maxZoom: 18
  },
  stamenWatercolor: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg`,
    attribution: 'Map tiles by Stamen Design, hosted by Stadia Maps. Data © OpenStreetMap contributors',
    maxZoom: 18
  },
  arcgisWorldStreet: {
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles © Esri',
    maxZoom: 19
  },
  arcgisWorldTopo: {
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles © Esri',
    maxZoom: 19
  },
  arcgisWorldImagery: {
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles © Esri',
    maxZoom: 19
  },
  arcgisNatGeo: {
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles © Esri',
    maxZoom: 19
  },
  arcgisLightGray: {
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles © Esri',
    maxZoom: 19
  },
  arcgisDarkGray: {
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labelsUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    attribution: 'Tiles © Esri',
    maxZoom: 19
  },
  mbOutdoors: {
    url: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/outdoors-v11',
  },
  mbStreets: {
    url: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
  },
  mbSatellite: {
    url: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/satellite-v9',
  },
  mbDark: {
    url: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/dark-v10',
  }
};

// This is a quick way to enable or ot the choice of a basemap
// in the UI without changing code elsewhere
const tileProviderEnable: Record<TileProvider, boolean> = {
  arcgisLightGray: true,
  arcgisDarkGray: false,
  arcgisNatGeo: true,
  arcgisWorldImagery: true,
  arcgisWorldStreet: true,
  arcgisWorldTopo: true,
  cartoDark: false,
  cartoVoyager: true,
  mbOutdoors: true,
  mbStreets: true,
  mbSatellite: true,
  mbDark: true,
  osm: true,
  otm: true,
  stamenTerrain: true,
  stamenDark: true,
  stamenWatercolor: true,
};

export const tileSourceEnable = new Map<TileProvider, boolean>(
  Object.entries(tileProviderEnable) as [TileProvider, boolean][]
);

const tileProviderLabels: Record<TileProvider, string> = {
  arcgisLightGray: 'ArcGIS - Light',
  arcgisDarkGray: 'ArcGIS - Dark',
  arcgisNatGeo: 'ArcGIS - NatGeo',
  arcgisWorldImagery: 'ArcGIS - Satellite',
  arcgisWorldStreet: 'ArcGIS - Street',
  arcgisWorldTopo: 'ArcGIS - Topo',
  cartoDark: 'Carto - Dark',
  cartoVoyager: 'Carto - Voyager',
  mbOutdoors: 'Mapbox - Outdoors',
  mbStreets: 'Mapbox - Streets',
  mbSatellite: 'Mapbox - Satellite',
  mbDark: 'Mapbox - Gray',
  osm: 'OpenStreetMap',
  otm: 'OpenTopoMap',
  stamenTerrain: 'Stamen - Terrain',
  stamenDark: 'Stamen - Dark',
  stamenWatercolor: 'Stamen - Watercolor',
};

export const tileSourceNames = new Map<TileProvider, string>(
  Object.entries(tileProviderLabels) as [TileProvider, string][]
);

const tileProviderColors: Record<TileProvider, string> = {
  arcgisDarkGray: '#474749',
  arcgisLightGray: '#efefef',
  arcgisNatGeo: '#b2c38f',
  arcgisWorldImagery: '#404b21',
  arcgisWorldStreet: '#c9caa0',
  arcgisWorldTopo: '#eaf1dd',
  cartoDark: '#090909',
  cartoVoyager: '#f0f2e6',
  mbOutdoors: '#c6e6aa',
  mbStreets: '#d2e7bf',
  mbSatellite: '#2d5319',
  mbDark: '#333432',
  osm: '#bddab1',
  otm: '#d3ad75',
  stamenTerrain: '#839f77',
  stamenDark: '#333432',
  stamenWatercolor: '#e9cbb1',
};

export const tileSourceColors = new Map<TileProvider, string>(
  Object.entries(tileProviderColors) as [TileProvider, string][]
);

const tileProviderTypes: Record<TileProvider, string> = {
  arcgisDarkGray: 'mono_dark_2',
  arcgisLightGray: 'mono_white_1',
  arcgisNatGeo: 'terrain_4',
  arcgisWorldImagery: 'satellite_1',
  arcgisWorldStreet: 'street_2',
  arcgisWorldTopo: 'terrain_2',
  cartoDark: 'mono_dark_1',
  cartoVoyager: 'street_0',
  mbOutdoors: 'terrain_3',
  mbStreets: 'street_1',
  mbSatellite: 'satellite_2',
  mbDark: 'mono_dark_3',
  osm: 'street_3',
  otm: 'terrain_5',
  stamenTerrain: 'terrain_6',
  stamenDark: 'mono_dark_4_2',
  stamenWatercolor: 'artist',
};

export const tileSourceTypes = new Map<TileProvider, string>(
  Object.entries(tileProviderTypes) as [TileProvider, string][]
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
