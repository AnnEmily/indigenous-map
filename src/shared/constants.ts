import { TileProvider } from "./types";

export const mapboxIds = new Map<TileProvider, string>([
  ['mbOutdoors', 'mapbox/outdoors-v11'],
  ['mbStreets', 'mapbox/streets-v11'],
  ['mbSatellite', 'mapbox/satellite-v9'],
]);
