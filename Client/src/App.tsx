import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import WeatherOutDoorInfo from "./components/Weather/OutdoorWeather";
import WeatherIndoor from "./components/Weather/IndoorWeather";
import DeviceControll from "./components/Devices/DeviceControll";
import MusicPlayer from "./components/Music/MusicPlayer";
import LightControll from "./components/Devices/LightControll";
import EnvironmentaAnalytics from "./components/Weather/EnvironmentaAnalytics";

function App() {
  return (
    <div
      id="dashboard-layout"
      className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-[#1a1a1a] text-background"
    >
      <aside className=" ">
        <Sidebar />
      </aside>
      <div className="main-content flex flex-col  overflow-hidden flex-1">
        <Header />
        <main className="content overflow-y-auto flex-grow px-2 sm:px-4">
          <div id="dashboard" className="max-w-full">
            <section id="Overview" className="w-full py-4">
              <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mx-2 sm:mx-4 md:mx-6">
                <WeatherOutDoorInfo />
                <WeatherIndoor />
                <DeviceControll />
              </div>
            </section>
            <section id="music-player" className="w-full py-3 px-2 sm:px-4">
              <div className="w-full overflow-x-auto">
                <MusicPlayer />
              </div>
            </section>
            <section id="light-controll" className="w-full py-3 px-2 sm:px-4">
              <div className="w-full overflow-x-auto">
                <LightControll />
              </div>
            </section>
            <section id="analytics" className="w-full py-3 px-2 sm:px-4 mb-4">
              <div className="w-full overflow-x-auto">
                <EnvironmentaAnalytics />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
