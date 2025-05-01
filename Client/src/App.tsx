import "./App.css";
import Header from "./components/Header/Header";
import WeatherOutDoorInfo from "./components/Weather/OutdoorWeather";
import WeatherIndoor from "./components/Weather/IndoorWeather";
import DeviceControll from "./components/Devices/DeviceControll";
import MusicPlayerLayout from "./components/Music/MusicPlayerLayout";
import LightControll from "./components/Devices/LightControll";
import EnvironmentaAnalytics from "./components/Weather/EnvironmentaAnalytics";
import { useEffect, useState, useRef } from "react";
import Api from "./api";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarNavigation } from "./components/Sidebar/Sidebar";
import { HoverBorderGradient } from "./components/ui/hover-border-gradient";


function App() {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const overviewRef = useRef<HTMLElement>(null);
  const musicPlayerRef = useRef<HTMLElement>(null);
  const lightControlRef = useRef<HTMLElement>(null);
  const analyticsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchSpotifyToken = async () => {
      try {
        const accessTokenResponse = await Api.get("/spotify/accessToken");
        setToken(accessTokenResponse.data.data.token);
        setisLoggedIn(true);
      } catch (error: any) {
        try {
          await Api.get("/spotify/refreshAccessToken");
          const newAccessTokenResponse = await Api.get("/spotify/accessToken");
          setToken(newAccessTokenResponse.data.data.token);
          setisLoggedIn(true);
          console.log(error?.message);
        } catch (refreshError) {
          setToken(null);
          setisLoggedIn(false);
          console.error("Spotify authentication failed:", refreshError);
        }
      }
    };

    fetchSpotifyToken();
  }, []);

  return (
    <div
      id="dashboard-layout"
      className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-[#1a1a1a] text-white"
    >
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <h1 className="text-2xl font-bold">Desk Sarthi</h1>
          </SidebarHeader>

          <SidebarNavigation />

          <SidebarFooter className="border-t p-4">
            <div className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Desk Sarthi
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-[#1a1a1a]">
          <div className="main-content flex flex-col overflow-hidden flex-1">
            <Header />
            <main className="content overflow-y-auto flex-grow px-2 sm:px-4">
              <div id="dashboard" className="max-w-full">
                <section
                  id="overview"
                  ref={overviewRef}
                  className="w-full py-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mx-2 sm:mx-4 md:mx-6">
                    <WeatherOutDoorInfo />
                    <WeatherIndoor />
                    <DeviceControll />
                  </div>
                </section>
                <section
                  id="music-player"
                  ref={musicPlayerRef}
                  className="w-full py-3 px-2 sm:px-4"
                >
                  <div className="w-full max-h[400px]">
                    <MusicPlayerLayout
                      token={token!}
                      setToken={setToken}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>
                </section>
                <section
                  id="light-control"
                  ref={lightControlRef}
                  className="w-full py-3 px-2 sm:px-4"
                >
                  <div className="w-full overflow-x-auto">
                    <LightControll />
                  </div>
                </section>
                <section
                  id="analytics"
                  ref={analyticsRef}
                  className="w-full py-3 px-2 sm:px-4 mb-4"
                >
                  <div className="w-full overflow-x-auto">
                    <EnvironmentaAnalytics />
                  </div>
                </section>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default App;
