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

// export const addNationLayers = (map: L.Map, data: FeatureCollection<Shapes, CommunityProperties>) => {
  
//   // 1. Create one single "Global Tooltip" for the whole map instance
//   // This prevents multiple tooltips fighting for focus/jumping on click.
//   const globalTooltip = L.tooltip({
//     sticky: false,
//     direction: 'top',
//     offset: [0, -15],
//     className: 'custom-tooltip',
//     permanent: false,
//     opacity: 1
//   });

//   // 2. Map-level listener to move the global tooltip smoothly
//   map.on('mousemove', (e: L.LeafletMouseEvent) => {
//     if (globalTooltip.isOpen()) {
//       globalTooltip.setLatLng(e.latlng);
//     }
//   });

//   data.features.forEach((feature) => {
//     const { id, nation, name } = feature.properties;
//     const color = nationColorMap.get(nation) || '#000';

//     let center: L.LatLng;
//     let bounds: L.LatLngBounds;

//     // Location Logic
//     if (feature.geometry.type === "Point") {
//       const [lng, lat] = feature.geometry.coordinates;
//       center = L.latLng(lat, lng);
//       bounds = L.latLngBounds(center, center);
//     } else {
//       const tempLayer = L.geoJSON(feature);
//       bounds = tempLayer.getBounds();
//       center = bounds.getCenter();
//     }

//     // --- POLYGON LAYER ---
//     const polygonLayer = L.geoJSON(feature, {
//       pointToLayer: () => L.layerGroup(), // Mute default markers
//       style: {
//         color: color,
//         fillOpacity: 0,
//         opacity: 0,
//         weight: 2,
//         className: `poly-${id} nation-${nation}`,
//       }
//     });

//     // --- MARKER LAYER (SVG Circle) ---
//     const marker = L.marker(center, {
//       icon: L.divIcon({
//         className: `custom-marker nation-${nation} marker-${id}`,
//         iconSize: [24, 24],
//         iconAnchor: [12, 12],
//         html: `
//           <svg width="24" height="24" viewBox="0 0 24 24" style="display: block;">
//             <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2" />
//           </svg>
//         `
//       })
//     });

//     // 3. Hover Logic: Using the Global Tooltip
//     const handleMouseOver = (e: L.LeafletMouseEvent) => {
//       globalTooltip
//         .setContent(name)
//         .setLatLng(e.latlng)
//         .addTo(map);
//     };

//     const handleMouseOut = () => {
//       globalTooltip.remove();
//     };

//     // Ensure click doesn't kill the tooltip
//     const handleClick = (e: L.LeafletMouseEvent) => {
//       // Re-assert the tooltip position and content on click
//       globalTooltip
//         .setContent(name)
//         .setLatLng(e.latlng)
//         .addTo(map);
        
//       // If you have map panning on click, we stop propagation here
//       L.DomEvent.stopPropagation(e as any);
//     };

//     polygonLayer.on({
//       mouseover: handleMouseOver,
//       mouseout: handleMouseOut,
//       mousemove: handleMouseOver, // Adding mousemove here acts as a "keep-alive"
//       click: handleClick
//     });

//     marker.on({
//       mouseover: handleMouseOver,
//       mouseout: handleMouseOut,
//       mousemove: handleMouseOver,
//       click: handleClick
//     });

//     // 4. Metadata & Cleanup
//     const metadata = { featureId: id, nationGroup: nation, bounds };
//     (polygonLayer as any)._meta = metadata;
//     (marker as any)._meta = metadata;

//     polygonLayer.addTo(map);
//     marker.addTo(map);
//   });
// };

export const addNationLayers = (map: L.Map, data: FeatureCollection<Shapes, CommunityProperties>) => {
  // 1. Global Tooltip (as established previously)
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
    const { id, nation, name } = feature.properties;
    const color = nationColorMap.get(nation) || '#000';

    let center: L.LatLng;
    let bounds: L.LatLngBounds;
    let visibilityBounds: L.LatLngBounds;

    // 2. Geometry Branching
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
      // 1. Get the "Main" part for the dot and the threshold logic
      const firstIslandRings = feature.geometry.coordinates[0];
      const latLngs = L.GeoJSON.coordsToLatLngs(firstIslandRings, 1) as L.LatLng[][];
      const firstIslandBounds = L.latLngBounds(latLngs[0]);
      
      center = firstIslandBounds.getCenter();
      visibilityBounds = firstIslandBounds; // We use THIS for the swap trigger

      // 2. We still need the FULL bounds for the map to know where the whole nation is
      const fullFeatureLayer = L.geoJSON(feature);
      bounds = fullFeatureLayer.getBounds();
    }

    // else if (feature.geometry.type === "MultiPolygon") {
    //   // 1. Convert the first "island" coordinates to LatLngs
    //   // [0][0] targets the outer ring of the first polygon
    //   const firstIslandRings = feature.geometry.coordinates[0];
    //   const latLngs = L.GeoJSON.coordsToLatLngs(firstIslandRings, 1) as L.LatLng[][];

    //   // 2. Calculate center using a simple LatLngBounds of just that first island
    //   const firstIslandBounds = L.latLngBounds(latLngs[0]);
    //   center = firstIslandBounds.getCenter();

    //   // 3. For the total bounds (used for zooming), use the whole feature
    //   const fullFeatureLayer = L.geoJSON(feature);
    //   bounds = fullFeatureLayer.getBounds();
    // }

    // else if (feature.geometry.type === "MultiPolygon") {
    //   // Convention: coordinates[0] is the "Main" polygon
    //   // We extract it as a standard Polygon to find the "Main Location" center
    //   const mainPolygon = L.polygon(feature.geometry.coordinates[0] as L.LatLngExpression[][]);
    //   center = mainPolygon.getBounds().getCenter();
      
    //   // Experiment: Using full bounds for now.
    //   // If the zoom feels too "wide", change this to mainPolygon.getBounds()
    //   const fullLayer = L.geoJSON(feature);
    //   bounds = fullLayer.getBounds();
    // }

    // 3. Layer Creation
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

    // 4. Unified Event Listeners
    const handleEnter = (e: L.LeafletMouseEvent) => {
      globalTooltip.setContent(name).setLatLng(e.latlng).addTo(map);
    };

    const handleLeave = () => globalTooltip.remove();

    const listeners = {
      mouseover: handleEnter,
      mouseout: handleLeave,
      mousemove: handleEnter, // The "Keep-alive"
      click: handleEnter      // Prevent disappearing on click
    };

    polygonLayer.on(listeners);
    marker.on(listeners);

    // 5. Metadata Attachment
    const metadata = { featureId: id, nationGroup: nation, bounds: visibilityBounds };
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
