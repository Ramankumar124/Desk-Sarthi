const WeatherIndoor = () => {
  const temperature = 45; // Replace with dynamic data if needed
  const humidity = 55; // Replace with dynamic data if needed

  const maxTemperature = 50; // Max range for temperature
  const maxHumidity = 100; // Max range for humidity

  // Status for temperature
  const temperatureStatus =
    temperature >= 35
      ? "Hot"
      : temperature >= 15
      ? "Normal"
      : "Cold";

  // Status for humidity
  const humidityStatus =
    humidity > 60
      ? "Humid"
      : humidity >= 30
      ? "Comfortable"
      : "Dry";

  return (
    <div className="bg-neutral-800 p-4 rounded-lg text-white flex flex-1 flex-col items-center gap-4 w-full min-h-[200px]  md:w-[500px]">
  <h2 className="text-lg md:text-xl font-semibold">Indoor Climate</h2>
  <div className="flex flex-wrap justify-center md:justify-around items-center space-x-8 md:space-x-8  md:space-y-0">
    {/* Temperature Circle */}
    <div className="relative w-28 h-28 md:w-40 md:h-40">
      <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
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
          strokeDashoffset={452 - (temperature / maxTemperature) * 452}
          className="text-blue-500 transition-all duration-500"
        ></circle>
      </svg>
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <span className="text-xl md:text-3xl font-bold">{temperature}°C</span>
        <p className="text-xs md:text-sm text-gray-300">{temperatureStatus}</p>
      </div>
      <p className="text-center mt-2 text-gray-400 text-sm md:text-base">Temperature</p>
    </div>
    {/* Humidity Circle */}
    
    <div className="relative w-28 h-28 md:w-40 md:h-40">
      <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
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
          strokeDashoffset={452 - (humidity / maxHumidity) * 452}
          className="text-green-500 transition-all duration-500"
        ></circle>
      </svg>
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <span className="text-xl md:text-3xl font-bold">{humidity}%</span>
        <p className="text-xs md:text-sm text-gray-300">{humidityStatus}</p>
      </div>
      <p className="text-center mt-2 text-gray-400 text-sm md:text-base">Humidity</p>
    </div>
  </div>
</div>
  );


}

export default WeatherIndoor