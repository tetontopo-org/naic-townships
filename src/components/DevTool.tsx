import { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

interface DevToolProps {
  map: maplibregl.Map | null;
}

export default function DevTool({ map }: DevToolProps) {
  const [mapState, setMapState] = useState({
    pitch: 0,
    zoom: 0,
    center: [0, 0] as [number, number],
  });

  useEffect(() => {
    if (!map) return;

    // Update initial state
    const updateState = () => {
      setMapState({
        pitch: Math.round(map.getPitch() * 100) / 100,
        zoom: Math.round(map.getZoom() * 100) / 100,
        center: map.getCenter().toArray() as [number, number],
      });
    };

    // Update state immediately
    updateState();

    // Listen for map movements
    const events = ["move", "zoom", "pitch", "rotate"] as const;

    events.forEach((event) => {
      map.on(event, updateState);
    });

    return () => {
      events.forEach((event) => {
        map.off(event, updateState);
      });
    };
  }, [map]);

  if (!map) return null;

  return (
    <div className="dev-tool">
      <div className="dev-tool-title">Map Debug Info</div>
      <div className="dev-tool-item">
        <span className="dev-tool-label">Pitch:</span>
        <span className="dev-tool-value">{mapState.pitch}°</span>
      </div>
      <div className="dev-tool-item">
        <span className="dev-tool-label">Zoom:</span>
        <span className="dev-tool-value">{mapState.zoom}</span>
      </div>
      <div className="dev-tool-item">
        <span className="dev-tool-label">Center:</span>
        <span className="dev-tool-value">
          [{mapState.center[0].toFixed(4)}, {mapState.center[1].toFixed(4)}]
        </span>
      </div>
    </div>
  );
}
