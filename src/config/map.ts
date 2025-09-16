const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

if (!MAPTILER_API_KEY) {
  throw new Error(
    "VITE_MAPTILER_API_KEY environment variable is required. Please check your .env file."
  );
}

export const MAP_CONFIG = {
  containerId: "map",
  center: [-124.176, 42.3034] as [number, number],
  zoom: 9.57,
  pitch: 35,
  minZoom: 2,
  maxZoom: 18,
  style: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_API_KEY}`,
  projection: { name: "globe" },
};
