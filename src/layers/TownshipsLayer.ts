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

  // Define event handlers
  const clickHandler = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    if (!feature) return;

    const coords = e.lngLat.toArray() as [number, number];
    const properties = feature.properties;

    // Format township information
    const townshipNumber = properties.TWNSHPNO || "N/A";
    const townshipFraction = properties.TWNSHPFRAC || "0";
    const townshipDirection = properties.TWNSHPDIR || "";
    const rangeNumber = properties.RANGENO || "N/A";
    const rangeFraction = properties.RANGEFRAC || "0";
    const rangeDirection = properties.RANGEDIR || "";
    const state = properties.STATEABBR || "N/A";
    const principalMeridian = properties.PRINMER || "N/A";

    // Create formatted township description
    const townshipDesc = `${townshipNumber}${
      townshipFraction !== "0" ? townshipFraction : ""
    }${townshipDirection}`;
    const rangeDesc = `${rangeNumber}${
      rangeFraction !== "0" ? rangeFraction : ""
    }${rangeDirection}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; text-decoration: underline;">Township Information</h3>
        <div style="margin-bottom: 6px;">
          <strong>Township:</strong> ${townshipDesc}
        </div>
        <div style="margin-bottom: 6px;">
          <strong>Range:</strong> ${rangeDesc}
        </div>
        <div style="margin-bottom: 6px;">
          <strong>State:</strong> ${state}
        </div>
        <div style="margin-bottom: 0;">
          <strong>Principal Meridian:</strong> ${principalMeridian}
        </div>
      </div>
    `;

    new Popup({
      closeOnClick: true,
      closeButton: true,
      maxWidth: "300px",
    })
      .setLngLat(coords)
      .setHTML(html)
      .addTo(map);
  };

  const mouseEnterHandler = () => (map.getCanvas().style.cursor = "pointer");
  const mouseLeaveHandler = () => (map.getCanvas().style.cursor = "");

  // Remove existing event listeners to prevent duplicates
  map.off("click", `${id}-fill`, clickHandler);
  map.off("click", `${id}-line`, clickHandler);
  map.off("click", `${id}-labels`, clickHandler);
  map.off("mouseenter", `${id}-fill`, mouseEnterHandler);
  map.off("mouseenter", `${id}-line`, mouseEnterHandler);
  map.off("mouseenter", `${id}-labels`, mouseEnterHandler);
  map.off("mouseleave", `${id}-fill`, mouseLeaveHandler);
  map.off("mouseleave", `${id}-line`, mouseLeaveHandler);
  map.off("mouseleave", `${id}-labels`, mouseLeaveHandler);

  // Add click handlers to all layers for better UX
  map.on("click", `${id}-fill`, clickHandler);
  map.on("click", `${id}-line`, clickHandler);
  map.on("click", `${id}-labels`, clickHandler);

  // Cursor feedback on all layers
  map.on("mouseenter", `${id}-fill`, mouseEnterHandler);
  map.on("mouseenter", `${id}-line`, mouseEnterHandler);
  map.on("mouseenter", `${id}-labels`, mouseEnterHandler);
  map.on("mouseleave", `${id}-fill`, mouseLeaveHandler);
  map.on("mouseleave", `${id}-line`, mouseLeaveHandler);
  map.on("mouseleave", `${id}-labels`, mouseLeaveHandler);
}
