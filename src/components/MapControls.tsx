import { useEffect } from "react";
import maplibregl from "maplibre-gl";

export default function MapControls({ map }: { map: maplibregl.Map | null }) {
  useEffect(() => {
    if (!map) return;
    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 120, unit: "imperial" }),
      "bottom-left"
    );
  }, [map]);
  return null;
}
