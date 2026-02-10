import { FeatureCollection } from "geojson";
import L from "leaflet";

import { CommunityProperties, Shapes, TileProvider } from "../../shared/types";
import { mapboxIds, nationColorMap } from "../../shared/constants";

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

export const addNationLayers = (map: L.Map, data: FeatureCollection<Shapes, CommunityProperties>) => {
  // Global tooltip for the whole map (prevents multiple competing tooltips)
  const globalTooltip = L.tooltip({
    sticky: false,
    direction: 'top',
    offset: [0, -15],
    className: 'custom-tooltip',
    permanent: false
  });

  map.on('mousemove', (e: L.LeafletMouseEvent) => {
    if (globalTooltip.isOpen()) {
      globalTooltip.setLatLng(e.latlng);
    }
  });

  data.features.forEach((feature) => {
    const { id, nation, name, states } = feature.properties;
    const color = nationColorMap.get(nation) || '#000';

    let center: L.LatLng;
    let bounds: L.LatLngBounds;
    let visibilityBounds: L.LatLngBounds;

    // Geometry Branching
    if (feature.geometry.type === "Point") {
      const [lng, lat] = feature.geometry.coordinates;
      center = L.latLng(lat, lng);
      bounds = L.latLngBounds(center, center);
      visibilityBounds = bounds;
    }
    else if (feature.geometry.type === "Polygon") {
      const tempLayer = L.geoJSON(feature);
      bounds = tempLayer.getBounds();
      center = bounds.getCenter();
      visibilityBounds = bounds;
    }
    else if (feature.geometry.type === "MultiPolygon") {
      // Get the "Main" part for the dot and the threshold logic
      const firstIslandRings = feature.geometry.coordinates[0];
      const latLngs = L.GeoJSON.coordsToLatLngs(firstIslandRings, 1) as L.LatLng[][];
      const firstIslandBounds = L.latLngBounds(latLngs[0]);
      
      center = firstIslandBounds.getCenter();
      visibilityBounds = firstIslandBounds; // We use THIS for the swap trigger

      // We still need the FULL bounds for the map to know where the whole nation is
      const fullFeatureLayer = L.geoJSON(feature);
      bounds = fullFeatureLayer.getBounds();
    }

    // Layer Creation
    const polygonLayer = L.geoJSON(feature, {
      pointToLayer: () => L.layerGroup(),
      style: {
        color: color,
        fillOpacity: 0,
        opacity: 0,
        weight: 2,
        className: `poly-${id} nation-${nation}`,
      }
    });

    const marker = L.marker(center, {
      icon: L.divIcon({
        className: `custom-marker nation-${nation} marker-${id}`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        html: `
          <svg width="24" height="24" viewBox="0 0 24 24" style="display: block;">
            <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2" />
          </svg>
        `
      })
    });

    // Event Listeners
    const handleEnter = (e: L.LeafletMouseEvent) => {
      globalTooltip.setContent(name).setLatLng(e.latlng).addTo(map);
    };

    const handleLeave = () => globalTooltip.remove();

    const listeners = {
      mouseover: handleEnter,
      mouseout: handleLeave,
      mousemove: handleEnter, // the "Keep-alive"
      click: handleEnter      // prevent disappearing on click
    };

    polygonLayer.on(listeners);
    marker.on(listeners);

    // Metadata Attachment
    const metadata = {
      featureId: id,
      nation,
      bounds: visibilityBounds,
      states: states || []
    };
    (polygonLayer as any)._meta = metadata;
    (marker as any)._meta = metadata;

    polygonLayer.addTo(map);

    // if (feature.geometry.type === "MultiPolygon") {
    //   console.log(`Checking ${name}:`, { center, boundsValid: bounds.isValid() });
    // }

    marker.addTo(map);
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
