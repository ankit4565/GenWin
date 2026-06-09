import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function TrafficMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [77.4126, 23.2599], // Bhopal
      zoom: 12,
      pitch: 60,
      bearing: -15,
    });

    map.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    // Sample Traffic Hotspots
    const hotspots = [
      [77.4126, 23.2599],
      [77.4350, 23.2330],
      [77.4010, 23.2700],
    ];

    hotspots.forEach((point) => {
      new maplibregl.Marker({ color: "red" })
        .setLngLat(point)
        .addTo(map.current);
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}