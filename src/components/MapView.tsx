import { useEffect } from "react";
import { useMaplibre } from "../hooks/useMaplibre";
import { MAP_CONFIG } from "../config/map";
import MapControls from "./MapControls";
//import DevTool from "./DevTool";
import MapTitle from "./MapTitle";
import LoadingScreen from "./LoadingScreen";
import { addTownshipsLayer } from "../layers/TownshipsLayer";

export default function MapView() {
  const { map, ready } = useMaplibre(MAP_CONFIG);

  useEffect(() => {
    if (!map || !ready) return;

    // Add the layer after the style loads
    const handleStyleLoad = () => {
      // Small delay to ensure style is fully loaded
      setTimeout(() => {
        addTownshipsLayer(map, "townships"); // stable IDs
      }, 100);
    };

    // If style is already loaded (e.g., hot reload), add right away
    if (map.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      // Wait for initial style load
      map.once("style.load", handleStyleLoad);
    }

    // Re-add after style reloads (needed for globe changes)
    map.on("style.load", handleStyleLoad);

    return () => {
      map.off("style.load", handleStyleLoad);
    };
  }, [map, ready]);

  return (
    <div className="map-wrap">
      <LoadingScreen isLoading={!ready} />
      <div id={MAP_CONFIG.containerId} className="map" />
      <MapTitle />
      <MapControls map={map ?? null} />
      {/* <DevTool map={map ?? null} /> */}
    </div>
  );
}
