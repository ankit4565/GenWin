import { useState, useEffect } from "react";
import { Cloud } from "lucide-react";
import { getWeather } from "../../services/weatherService";

export default function Weather() {
  const [lastSync, setLastSync] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();

    const interval = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString());
      fetchWeather();
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur p-3 rounded-lg flex items-center gap-3 shadow-md">
      <Cloud className="w-6 h-6 text-green-700" />

      {weather ? (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {weather?.current?.temperature_2m ?? "--"}°C
          </span>

          <span className="text-xs text-gray-500">
            Updated: {lastSync || "Just now"}
          </span>
        </div>
      ) : (
        <span className="text-sm">Loading weather...</span>
      )}
    </div>
  );
}