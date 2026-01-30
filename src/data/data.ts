import { FeatureCollection, Point } from "geojson";
import { Nation } from "../shared/types";

interface CommunityProperties {
  nation: Nation;
  name: string;
}

export const geoJson: FeatureCollection<Point, CommunityProperties> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        nation: "micmac",
        name: "Listuguj",
      },
      geometry: {
        type: "Point",
        coordinates: [-66.70064, 48.01582],
      }
    },
    {
      type: "Feature",
      properties: {
        nation: "micmac",
        name: "Gesgapegiag",
       },
      geometry: {
        type: "Point",
        coordinates: [-65.92778, 48.19607],
      }
    },
    {
      type: "Feature",
      properties: {
        nation: "micmac",
        name: "Gespeg",
       },
      geometry: {
        type: "Point",
        coordinates: [-64.55917, 48.89275],
      }
    },
    {
      type: "Feature",
      properties: {
        nation: "wolastoqiyik",
        name: "Kataskomik",
       },
      geometry: {
        type: "Point",
        coordinates: [-69.27413, 47.70410],
      }
    },
    {
      type: "Feature",
      properties: {
        nation: "abenaki",
        name: "Odanak",
       },
      geometry: {
        type: "Point",
        coordinates: [-72.81625, 46.08026],
      }
    },
    {
      type: "Feature",
      properties: {
        nation: "abenaki",
        name: "Wôlinak",
       },
      geometry: {
        type: "Point",
        coordinates: [-72.42646, 46.32281],
      }
    },
  ]
};

export default geoJson;
