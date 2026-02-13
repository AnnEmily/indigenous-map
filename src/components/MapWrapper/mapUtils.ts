import { FeatureCollection } from "geojson";
import L from "leaflet";
import 'leaflet.markercluster';

import { CommunityProperties, Shapes, TileProvider } from "../../shared/types";
import { DISABLE_CLUSTERING_AT_ZOOM, mapboxIds, MAX_CLUSTER_RADIUS, MIN_PIXEL_AREA, nationColorMap } from "../../shared/constants";

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

export const addZoomControl = (map: L.Map) => {
  const zoomStr = () => (`Zoom factor: ${map.getZoom()}`);
  const zoomControl = new L.Control({ position: "bottomleft" });

  zoomControl.onAdd = () => {
    const div = L.DomUtil.create("div", "zoom-control");
    div.innerHTML = zoomStr();
    return div;
  };

  zoomControl.addTo(map);

  map.on("zoomend", () => {
    const div = document.querySelector(".zoom-control");
    if (div) {
      div.innerHTML = zoomStr();
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

  // Initialize the cluster group
  const clusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: MAX_CLUSTER_RADIUS, // increase to make clustering more "aggressive"
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: DISABLE_CLUSTERING_AT_ZOOM, // stop clustering when zoomed in enough

    iconCreateFunction: (cluster) => {
      const markers = cluster.getAllChildMarkers();

      // Get unique nations from the markers in this cluster
      const nationsInCluster = new Set(
        markers.map(m => (m as any)._meta.nation)
      );

      // Cluster color: gray (or whatever set in css) for mixed nations,
      // otherwise as nation color if it represents a single one
      let bgProp: string = null;
      const isSingleNation = nationsInCluster.size === 1;

      if (isSingleNation) {
        const nationName = Array.from(nationsInCluster)[0];
        const clusterColor = nationColorMap.get(nationName);
        bgProp = `background-color: ${clusterColor};`;
      }

      const count = cluster.getChildCount();

      return L.divIcon({
        html: `
          <div class="cluster-blob" style="${bgProp}; border-color: white;">
            <span>${count}</span>
          </div>
        `,
        className: 'custom-cluster-icon',
        iconSize: L.point(40, 40),
      });
    }
  });

  map.on('mousemove', (e: L.LeafletMouseEvent) => {
    if (globalTooltip.isOpen()) {
      globalTooltip.setLatLng(e.latlng);
    }
  });

  const markersArray: L.Marker[] = [];

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
      visibilityBounds = firstIslandBounds; // We use this for the swap trigger

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

    markersArray.push(marker);
    (polygonLayer as any)._meta = metadata;
    (marker as any)._meta = metadata;

    // Add layers to map
    polygonLayer.addTo(map);
    clusterGroup.addLayer(marker);
  });

  // Add the whole cluster group to the map at once
  map.addLayer(clusterGroup);

  return { clusterGroup, allMarkers: markersArray };
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

export const processLayer = (layer: any, map: L.Map, nations: string[], states: string[]) => {
    if (!layer._meta) return;

    // Handle polygons visibility
    const { nation, bounds, states: layerStates } = layer._meta;
    const isSelected = nations.includes(nation) && states.some(s => layerStates.includes(s));

    const nw = map.latLngToLayerPoint(bounds.getNorthWest());
    const se = map.latLngToLayerPoint(bounds.getSouthEast());
    const pixelArea = Math.abs(se.x - nw.x) * Math.abs(se.y - nw.y);

    if (layer instanceof L.GeoJSON) {
      const shouldShowPoly = isSelected && pixelArea >= MIN_PIXEL_AREA;
      layer.setStyle({
        opacity: shouldShowPoly ? 1 : 0,
        fillOpacity: shouldShowPoly ? 0.3 : 0,
        interactive: shouldShowPoly
      });
    }
  };
