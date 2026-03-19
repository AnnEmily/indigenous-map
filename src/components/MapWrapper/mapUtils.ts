import { Feature, FeatureCollection, Position } from "geojson";
import L from "leaflet";
import * as turf from '@turf/turf';
import 'leaflet.markercluster';

import { GeoJson, MarkerMeta, Nation, TileProvider } from "../../shared/types";
import { DISABLE_CLUSTERING_AT_ZOOM, MAX_CLUSTER_RADIUS, MIN_PIXEL_AREA, nationColorMap, providerConfigs } from "../../shared/constants";

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

export const addNationLayers = (map: L.Map, data: GeoJson) => {
  // Global tooltip for the whole map (prevents multiple competing tooltips)
  const globalTooltip = L.tooltip({
    sticky: false,
    direction: 'top',
    offset: [0, -5],
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

  const markersArray: L.CircleMarker[] = [];

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

    // AEG
    // const marker = L.marker(center, {
    //   icon: L.divIcon({
    //     className: `custom-marker nation-${nation} marker-${id}`,
    //     iconSize: [24, 24],
    //     iconAnchor: [12, 12],
    //     html: `
    //       <div aria-label="${feature.properties.name}">
    //         <svg width="24" height="24" viewBox="0 0 24 24" style="display: block;">
    //           <circle cx="12" cy="12" r="6" fill="${color}" stroke="white" stroke-width="2" />
    //         </svg>
    //       </div>
    //     `
    //   })
    // });

    const marker = L.circleMarker(center, {
      radius: 6,
      fillColor: color,
      color: 'white',     // stroke color
      weight: 2,          // stroke width
      opacity: 1,         // stroke opacity
      fillOpacity: 1
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
    const metadata: MarkerMeta = {
      featureId: id,
      nation,
      bounds: visibilityBounds,
      states: states || [],
      container: "cluster" as "cluster" | "map" | null
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

export const closeGeoJsonRings = (data: GeoJson): GeoJson => {
  data.features.forEach(f => {
    const geom = f.geometry;

    if (geom.type === "Polygon") {
      geom.coordinates = geom.coordinates.map(ring =>
        isOpenRing(ring) ? [...ring, ring[0]] : ring
      );
    }

    if (geom.type === "MultiPolygon") {
      geom.coordinates = geom.coordinates.map(poly => poly.map(ring =>
        isOpenRing(ring) ? [...ring, ring[0]] : ring)
      );
    }
  });

  return data;
};

export function computeNationHulls(geoJson: FeatureCollection): Map<Nation, L.Polygon> {
  const grouped = new Map<Nation, Feature[]>();

  geoJson.features.forEach((feature) => {
    const nation = feature.properties.nation;
    if (!grouped.has(nation)) grouped.set(nation, []);
    grouped.get(nation)!.push(feature);
  });

  const result = new Map<Nation, L.Polygon>();

  grouped.forEach((features, nation) => {
    if (features.length < 3) return;

    const points = features.map(f => {
      if (f.geometry.type === "MultiPolygon") {
        const firstPolygon = f.geometry.coordinates[0];
        return turf.centroid(turf.polygon(firstPolygon));
      }

      if (f.geometry.type === "Polygon") {
        return turf.centroid(f);
      }

      if (f.geometry.type === "Point") {
        return turf.point(f.geometry.coordinates);
      }

      return null;
    }).filter(Boolean);

    const fc = turf.featureCollection(points as any);
    const hull = turf.convex(fc);

    if (!hull) return;

    const coords = hull.geometry.coordinates[0].map(
      ([lng, lat]) => [lat, lng]
    );

    const leafletPolygon = L.polygon(coords as any, { // AEG as any unsure
      color: nationColorMap.get(nation),
      fillColor: nationColorMap.get(nation),
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.25,
      interactive: false
    });

    result.set(nation, leafletPolygon);
  });

  return result;
};

export const createTileLayer = (tileSource: TileProvider): L.Layer => {
  const { url, labelsUrl, ...options } = providerConfigs[tileSource] ?? providerConfigs['osm'];

  const baseLayer = L.tileLayer(url, {
    ...options,
    className: options.tileClassName || '',
  });

  if (labelsUrl) {
    const labelsLayer = L.tileLayer(labelsUrl, {
      ...options,
      pane: 'basemapLabels'
    });

    return L.layerGroup([baseLayer, labelsLayer]);
  }

  return baseLayer;
};

export function getClosedCoords(latLngs: L.LatLng[]): [number, number][] {
  const coords: [number, number][] = latLngs.map(ll => [ll.lng, ll.lat]);
  return isOpenRing(coords) ? [...coords, coords[0]] : coords;
}

export const isOpenRing = (ring: Position[]): boolean => {
  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] !== last[0] || first[1] !== last[1];
};

export const processPolygonsLayer = (
  layer: any,
  map: L.Map,
  nations: string[],
  states: string[],
  isHullMode: boolean,
  forcePolygons: boolean,
) => {
  if (!layer._meta) return;

  // Handle polygons visibility
  const { nation, bounds, states: layerStates } = layer._meta;
  const isSelected = nations.includes(nation) && states.some(s => layerStates.includes(s));

  const nw = map.latLngToLayerPoint(bounds.getNorthWest());
  const se = map.latLngToLayerPoint(bounds.getSouthEast());
  const pixelArea = Math.abs(se.x - nw.x) * Math.abs(se.y - nw.y);

  // Hull mode override
  if (layer instanceof L.GeoJSON) {
    if (isHullMode) {
      layer.setStyle({
        opacity: 0,
        fillOpacity: 0,
        interactive: false
      });
      return;
    }

    // Normal polygon logic
    const polygonThreshold = forcePolygons ? 0 : MIN_PIXEL_AREA;
    const shouldShowPoly = isSelected && pixelArea >= polygonThreshold;

    layer.setStyle({
      opacity: shouldShowPoly ? 1 : 0,
      fillOpacity: shouldShowPoly ? 0.3 : 0,
      interactive: shouldShowPoly
    });
  }
};

export const sanityCheckGeoJson = (data: GeoJson) => {
  // Sanity check: flag open rings in raw data

  const warnForOpenRing = (poly: Position[][], polyId: number, featureId: number) => {
    poly.forEach((ring, ringId: number) => {
      if (isOpenRing(ring)) {
        console.warn(`Open ring found in feature ${featureId}, polygon ${polyId}, ring ${ringId}`);
      }
    });
  };

  data.features.forEach(feature => {
    const geom = feature.geometry;

    if (geom.type === "Polygon") {
      [geom.coordinates].forEach((polygon, i) => {
        warnForOpenRing(polygon, i, feature.properties.id);
      });
    }

    if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((polygons, i) => {
        warnForOpenRing(polygons, i, feature.properties.id);
      });
    }
  });
};
