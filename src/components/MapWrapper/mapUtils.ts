import L from "leaflet";
import { TileProvider } from "../../shared/types";
import { mapboxIds } from "../../shared/constants";


export const addCoordsControl = (map: L.Map) => {
  const coordsControl = new L.Control({ position: "bottomleft" });

  coordsControl.onAdd = () => {
    const div = L.DomUtil.create("div", "coords-control");
    div.innerHTML = "Lat: –, Lng: –";
    return div;
  };

  coordsControl.addTo(map);

  map.on("mousemove", (e) => {
    const { lat, lng } = e.latlng;
    const div = document.querySelector(".coords-control");
    if (div) {
      div.innerHTML = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    }
  });
};

export const createTileLayer = (tileSource: TileProvider): L.TileLayer => {
  if (['mbOutdoors', 'mbStreets', 'mbSatellite'].includes(tileSource)) {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    return L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
      {
        attribution:
          '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ' +
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
        id: mapboxIds.get(tileSource),
      }
    );
  }

  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  });
};
