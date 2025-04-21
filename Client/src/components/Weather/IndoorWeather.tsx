import Api from "@/api";
import { useSocket } from "@/context/socket";
import { useEffect, useState } from "react";
import { TfiReload } from "react-icons/tfi";
const WeatherIndoor = () => {
  const [temp, settemp] = useState(0);
  const [hum, sethum] = useState(0);
  const { socket } = useSocket();

  const handleReloadIndoorClimate =async () => {
  await  Api.get("/weather/IndoorClimate");
  };

  useEffect(() => {
    handleReloadIndoorClimate();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("heatIndex", (data) => {
        try {
          const parsedData = JSON.parse(data.data);
          settemp(parsedData?.temp);
          sethum(parsedData?.hum);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });
    }
  }, [socket]);

  const maxTemperature = 50;
  const maxHumidity = 100;

  // Status for temperature
  const temperatureStatus = temp >= 35 ? "Hot" : temp >= 15 ? "Normal" : "Cold";

  // Status for humidity
  const humidityStatus = hum > 60 ? "Humid" : hum >= 30 ? "Comfortable" : "Dry";

  return (
    <div className="bg-neutral-800 p-4 rounded-lg text-white flex flex-1 flex-col items-center gap-4 w-full min-h-[200px] relative">
      <h2 className="text-lg md:text-xl font-semibold">Indoor Climate</h2>
      <div className="flex flex-wrap justify-around w-full    py-2">
        {/* Temperature Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full transform -rotate-90"
            >
              <circle
                cx="80"
                cy="80"
                r="72"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-neutral-600"
              ></circle>
              <circle
                cx="80"
                cy="80"
                r="72"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray="452"
                strokeDashoffset={452 - (temp / maxTemperature) * 452}
                className="text-blue-500 transition-all duration-500"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {temp}°C
              </span>
              <p className="text-xs sm:text-sm text-gray-300">
                {temperatureStatus}
              </p>
            </div>
          </div>
          <p className="text-center mt-2 text-gray-400 text-xs sm:text-sm md:text-base">
            Temperature
          </p>
        </div>

        {/* Humidity Circle */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full transform -rotate-90"
            >
              <circle
                cx="80"
                cy="80"
                r="72"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-neutral-600"
              ></circle>
              <circle
                cx="80"
                cy="80"
                r="72"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray="452"
                strokeDashoffset={452 - (hum / maxHumidity) * 452}
                className="text-green-500 transition-all duration-500"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {hum}%
              </span>
              <p className="text-xs sm:text-sm text-gray-300">
                {humidityStatus}
              </p>
            </div>
          </div>
          <p className="text-center mt-2 text-gray-400 text-xs sm:text-sm md:text-base">
            Humidity
          </p>
        </div>
      </div>
      <div className="absolute right-5 bottom-3  md:right-5 md:bottom-5 text-gray-400 hover:text-white cursor-pointer transition-colors">
        <TfiReload size={18} onClick={handleReloadIndoorClimate} />
      </div>
    </div>
  );
};

export default WeatherIndoor;
