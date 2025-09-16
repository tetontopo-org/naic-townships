import { Map, Popup } from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";
import townships from "../data/townships-simple.geojson?url";

export function addTownshipsLayer(map: Map, id = "sample") {
  // Remove existing source and layers if they exist (handles style reloads)
  if (map.getSource(id)) {
    // Remove layers first, then source
    if (map.getLayer(`${id}-fill`)) map.removeLayer(`${id}-fill`);
    if (map.getLayer(`${id}-line`)) map.removeLayer(`${id}-line`);
    if (map.getLayer(`${id}-labels`)) map.removeLayer(`${id}-labels`);
    map.removeSource(id);
  }

  map.addSource(id, {
    type: "geojson",
    data: townships,
    generateId: true,
  });

  map.addLayer({
    id: `${id}-fill`,
    type: "fill",
    source: id,
    paint: {
      "fill-color": "#3b82f6",
      "fill-opacity": 0.2,
    },
    filter: ["==", ["geometry-type"], "Polygon"],
  });

  map.addLayer({
    id: `${id}-line`,
    type: "line",
    source: id,
    paint: {
      "line-color": "#1f2937",
      "line-width": 2,
    },
  });

  // Add township labels
  map.addLayer({
    id: `${id}-labels`,
    type: "symbol",
    source: id,
    layout: {
      "text-field": ["get", "TWNSHPLAB"],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-size": 12,
      "text-anchor": "center",
      "text-allow-overlap": false,
      "text-ignore-placement": false,
    },
    paint: {
      "text-color": "#1f2937",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2,
    },
  });
}
