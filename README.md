# Indigenous map

This is a mapping app I coded to explore cartographic libraries. It focuses on the indigenous groups of Eastern Canada.

Some interesting features:
- dynamic size of points. Size varies with zoom to avoid a messy display at low zoom factor
- clustering of communities
- convex hulls to display the global spread of each nation
- local polygons showing the community spread, including their hunting lands
- points filterable by nation or province
- selectable tile provider
- optional latitude/longitude, zoom factor and scale

To avoid as much as possible costly re-renders, I enforced the following two strategies:

- adjust map features with CSS properties instead of manipulating DOM entities
- to avoid drilling down a user selection to the target component, use global state that is passed directly to the child component.

Target device is dektop, tested on Chrome 146.
## Live demo

https://annemily.github.io/indigenous-map/

## Tools used

- Framework: React
- Components: MUI
- GIS libraries: Leaflet, Turf
- Tile providers: OpenStreetMap, Mapbox, ArcGIS, Stadia
- Data type: geoJSON
- State management: Zustand
- Bundler: Vite
- Builder: GitHub Actions
- Linter: Eslint

## TODOs

Plenty of features could be added to make the app more professional ! For instance:

- clickable pins, where more info would be shown in a modal about the nation or community: population, governement, language, other names, links to websites, etc

- add more indigenous group. There are more than 22k communities across Canada, while I have less than a 100 here.

## Relevant links

Government of Canada  
[First Nation profiles interactive map](https://geo.sac-isc.gc.ca/cippn-fnpim/index-eng.html)

Government of Canada  
[Open Maps](https://search.open.canada.ca/openmap/522b07b9-78e2-4819-b736-ad9208eb1067)

Government of Quebec  
[Les 11 nations autochtones du Québec](https://experience.arcgis.com/experience/ef1b4393d43a4a76a2b8655f57a8f878/page/Nation?views=Home#data_s=id%3AdataSource_1-193b74dc84f-layer-2%3A50%2Cwhere%3AdataSource_2-19368ac7ad5-layer-2~dataSource_3-193b78ce560-layer-2~dataSource_4-193b78ce560-layer-2%3Amce_commu%20IN%20('Gespeg'))

Government of Ontario  
[Ontario First Nations Directory](https://chiefs-of-ontario.org/resources/map/)

Unrecognized NunatuKavut  
[NunatuKavut Map Tour](https://www.google.com/maps/d/viewer?mid=1XtvACpsHbaX53Hp7ZohDR3AiyUoBYKU&femb=1&ll=54.418062502730145%2C-60.496367379033586&z=6)

Government of Canada  
[Federal datasets](https://clss.nrcan-rncan.gc.ca/data-donnees/sgb_datasets)

Université Laval  
[GeoIndex](https://geoapp.bibl.ulaval.ca/)

Useful to enter manual data  
[GeoJson.io](https://geojson.io/#map=3.88/54.15/-71.28)

<!-- [Source inspiration](https://cdn-contenu.quebec.ca/cdn-contenu/adm/min/conseil-executif/publications-adm/srpni/administratives/cartes/Carte-web_1200_px.jpg)   -->
