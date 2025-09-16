import { useEffect, useRef, useState } from "react";
import maplibregl, { Map } from "maplibre-gl";

type UseMapOptions = {
  containerId: string;
  style: string;
  center: [number, number];
  zoom?: number;
  pitch?: number;
  minZoom?: number;
  maxZoom?: number;
  projection?: { name: string };
};

export function useMaplibre(opts: UseMapOptions) {
  const mapRef = useRef<Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;
    const map = new maplibregl.Map({
      container: opts.containerId,
      style: opts.style,
      center: opts.center,
      zoom: opts.zoom ?? 4,
      pitch: opts.pitch ?? 0,
      minZoom: opts.minZoom,
      maxZoom: opts.maxZoom,
      attributionControl: false,
    });
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );
    map.on("load", () => setReady(true));

    // Set globe projection when style loads
    map.on("style.load", () => {
      map.setProjection({
        type: "globe", // Set projection to globe
      });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [
    opts.containerId,
    opts.style,
    opts.center,
    opts.zoom,
    opts.pitch,
    opts.minZoom,
    opts.maxZoom,
  ]);

  return { map: mapRef.current, ready };
}
