import DeviceControll from "./components/Devices/DeviceControll";
import EnvironmentaAnalytics from "./components/Weather/EnvironmentaAnalytics";
import LightControll from "./components/Devices/LightControll";
import MusicPlayer from "./components/Music/MusicPlayer";
import WeatherIndoor from "./components/Weather/IndoorWeather";
import WeatherOutDoorInfo from "./components/Weather/OutdoorWeather";

export default function Dashboard() {
  return (
    <div id="dashboard">
      <section id="Overview" className="w-full ">
        <div className="grid lg:grid-cols-3   gap-8 m-4 md:m-8">
          <WeatherOutDoorInfo />
          <WeatherIndoor />
          <DeviceControll />
        </div>
      </section>
      <section
        id="music-player"
        className="w-full flex items-center p-4 justify-between"
      >
        <MusicPlayer />
      </section>
      <section
        id="light-controll"
        className="w-full flex items-center p-6 justify-between"
      >
        <LightControll />
      </section>
      <section id="analytics" className="w-full">
         <EnvironmentaAnalytics/>
      </section>
    </div>
  );
}
