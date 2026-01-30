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
  ['micmac', '#f36f24'],
  ['cree', '#f8Aa3b'],
  ['wolastoqiyik', '#ffdf00'],
  ['abenaki', '#b77739'],
]);
