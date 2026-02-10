import { Nation, TileProvider } from "./types";

export const mapboxIds = new Map<TileProvider, string>([
  ['mbOutdoors', 'mapbox/outdoors-v11'],
  ['mbStreets', 'mapbox/streets-v11'],
  ['mbSatellite', 'mapbox/satellite-v9'],
  ['mbDark', 'mapbox/dark-v10'],
]);

export const tileSourceNames = new Map<TileProvider, string>([
  ['osm', 'OpenStreetMap'],
  ['mbOutdoors', 'Mapbox - Outdoors'],
  ['mbStreets', 'Mapbox - Streets'],
  ['mbSatellite', 'Mapbox - Satellite'],
  ['mbDark', 'Mapbox - Dark'],
]);

export const nationColorMap = new Map<Nation, string>([
  ['abenaki', '#b77739'],
  ['cree', '#f8Aa3b'],
  ['innu', '#7E73B5'],
  ['inuit', '#7dcff5'],
  ['metis', '#ec24f3'],
  ['micmac', '#f36f24'],
  ['mohawk', '#00b1ea'],
  ['naskapi', '#5EB04C'],
  ['wolastoqiyik', '#ffdf00'],
]);
