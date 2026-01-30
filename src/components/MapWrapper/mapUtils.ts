import L from "leaflet";

import { TileProvider } from "../../shared/types";
import { mapboxIds, nationColorMap } from "../../shared/constants";
import { geoJson } from "../../data/data";

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

export const addMarkers = (map: L.Map) => {
  geoJson.features.forEach(feature => {
    const { nation, name } = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;
    const color = nationColorMap.get(nation);

    // This is the container of the marker, which is styled itself in the CSS.
    // It acts as a hitbox around the visible marker, eg the area around the
    // marker that will trigger an onClick event showing popup or else.
    // The container should be larger than the marker itself to allow room
    const myIcon = L.divIcon({
      className: `custom-marker nation-${nation}`,
      html: `<div class="marker-blob" style="--nation-color: ${color || 'red'};"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -10],
    });

    L.marker([lat, lng], { icon: myIcon })
      .addTo(map)
      .bindPopup(`<b>${name}</b>`);
  });
};

export const createTileLayer = (tileSource: TileProvider): L.TileLayer => {
  if (['mbOutdoors', 'mbStreets', 'mbSatellite', 'mbDark'].includes(tileSource)) {
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
