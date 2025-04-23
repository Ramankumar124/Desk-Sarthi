"use client";
import { Slider } from "@/components/ui/slider";

import { GiSpeaker } from "react-icons/gi";
import { IoPlayOutline, IoSearch } from "react-icons/io5";
import { PiMusicNotes } from "react-icons/pi";
import { RiLoopLeftLine } from "react-icons/ri";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";

const MusicPlayer = () => {
  // const router = useRouter();
  // const [token, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const accessToken = router.query.access_token as string;
  //   if (accessToken) {
  //     setToken(accessToken);
  //     localStorage.setItem("spotify_token", accessToken); // Store for later use
  //   }
  // }, [router.query.access_token]);
  // if (!token) return <p>Loading...</p>;

  return (
    <div className=" bg-secondary grid grid-cols-1 md:grid-cols-2 md:flex text-primary w-full gap-8 p-2  ">
      <div id="music-left " className="w-full md:w-1/2 bg-primary">
        <div className="bg-neutral-800 rounded-xl p-6  transition-all">
          <h3 className="text-white mb-6 text-lg font-semibold">
            Music Player
          </h3>
          <div className="relative  mb-6">
            <input
              type="text"
              placeholder="Search for music..."
              className="w-full bg-neutral-700 text-white rounded-lg
            pl-10 md:pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <IoSearch className="w-5 h-5 absolute left-3 top-3.5 text-neutral-400" />
          </div>

          <div className="bg-neutral-700/30 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-neutral-600 rounded-lg flex-shrink-0"></div>
              <div className="ml-4">
                <h4 className="text-white font-semibold">Now Playing</h4>
                <p className="text-neutral-400 text-sm">Artist Name</p>
              </div>
            </div>

            <div className=" md:mb-4">
              <div className="relative w-full h-1 bg-neutral-600 rounded">
                <Slider
                  onValueChange={() => console.log("helloe")}
                  defaultValue={[33]}
                  max={100}
                  step={1}
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>1:23</span>
                <span>3:45</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-6">
              <button className="text-neutral-400 hover:text-white text-xl md:text-3xl transition-colors">
                <TbPlayerTrackPrev />
              </button>
              <button className="bg-blue-500 text-white rounded-full text-xl md:text-3xl p-4 hover:bg-blue-600 transition-colors font-extrabold">
                <IoPlayOutline />
              </button>
              <button className="text-neutral-400 hover:text-white text-xl md:text-3xl transition-colors">
                <TbPlayerTrackNext />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-neutral-400 hover:text-white text-3xl transition-colors">
              <RiLoopLeftLine />
            </button>
            <div className="flex items-center text-3xl">
              <GiSpeaker />
              <div className="bg-neutral-600 w-32">
                <Slider
                  onValueChange={() => console.log("helloe")}
                  defaultValue={[33]}
                  max={100}
                  step={1}
                />
              </div>
            </div>
            <button className="text-neutral-400 text-3xl hover:text-white transition-colors">
              <PiMusicNotes />
            </button>
          </div>
        </div>
      </div>
      <div id="music-right" className="w-full md:w-1/2 bg-primary">
        <div className="bg-neutral-800 rounded-xl h-full p-6  transition-all">
          <h3 className="text-white mb-6 text-lg font-semibold">Queue</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-neutral-600 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-grow">
                <h4 className="text-white text-sm">Track Title 1</h4>
                <p className="text-neutral-400 text-xs">Artist Name</p>
              </div>
              <span className="text-neutral-400 text-sm">3:45</span>
            </div>

            <div className="flex items-center p-3 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-neutral-600 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-grow">
                <h4 className="text-white text-sm">Track Title 2</h4>
                <p className="text-neutral-400 text-xs">Artist Name</p>
              </div>
              <span className="text-neutral-400 text-sm">4:20</span>
            </div>

            <div className="flex items-center p-3 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-neutral-600 rounded flex-shrink-0"></div>
              <div className="ml-4 flex-grow">
                <h4 className="text-white text-sm">Track Title 3</h4>
                <p className="text-neutral-400 text-xs">Artist Name</p>
              </div>
              <span className="text-neutral-400 text-sm">3:30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
