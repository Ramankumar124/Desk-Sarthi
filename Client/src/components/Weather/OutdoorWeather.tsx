import { useEffect, useState } from "react";
import { GrLocation } from "react-icons/gr";
import { MdCloudQueue } from "react-icons/md";
import Api from "@/api";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility: number;
}
const WeatherOutDoorInfo = () => {
  const [weather, setweather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        let response = await Api.get("/weather/outdoor-climate", {
          withCredentials: true,
        });
        let result = await response.data;
        setweather(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getWeatherData();
  }, []);

  return (
    <div className="bg-neutral-800  rounded-xl p-6 transition-all ">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-background text-sm mb-1">Weather Info</h3>
          <div className="flex items-center space-x-2">
            <GrLocation className=" text-3xl font-bold " />
            <span className="text-white">{weather?.name}, India</span>
          </div>
        </div>
        <div className="bg-blue-600/10 p-2 text-blue-600 rounded-lg text-2xl">
          <MdCloudQueue />
        </div>
      </div>

      <div className="flex items-center justify-between" id="el-8fukabrm">
        <div id="el-l7ujnop2">
          <h1 className="text-4xl font-bold text-white mb-1" id="el-usenoeet">
            {Math.floor(weather?.main?.temp!)}°C
          </h1>
          <p className="text-blue-400" id="el-2we326uc">
            Heavy Rain
          </p>
        </div>
        <div className="text-right" id="el-um794ynh">
          <p className="text-gray-400 text-sm mb-1" id="el-x64rq72u">
            Humidity
          </p>
          <p className="text-white text-lg" id="el-wicj3ipq">
            {weather?.main?.humidity}%
          </p>
        </div>
      </div>

      <div
        className="mt-6 pt-6 border-t border-neutral-700/20"
        id="el-110jpqv6"
      >
        <div
          className="flex items-center justify-between text-sm"
          id="el-ii8wjtsd"
        >
          <div className="text-center" id="el-9w8t322i">
            <p className="text-gray-400 mb-1" id="el-n5dqnj7u">
              Wind
            </p>
            <p className="text-white" id="el-rqnwt1h8">
              {(weather?.wind?.speed!* 3.6).toFixed(2)} km/h
            </p>
          </div>
          <div className="text-center" id="el-afla1o7v">
            <p className="text-gray-400 mb-1" id="el-ubfp1vya">
              Pressure
            </p>
            <p className="text-white" id="el-3ifh3yza">
              {weather?.main?.pressure} hPa
            </p>
          </div>
          <div className="text-center" id="el-8vgfqvmu">
            <p className="text-gray-400 mb-1" id="el-nm97qrdv">
              Visibility
            </p>
            <p className="text-white" id="el-2kxt5rl6">
              {weather?.visibility! / 1000} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherOutDoorInfo;
