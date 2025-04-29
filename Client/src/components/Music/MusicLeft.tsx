import {
  changeVolume,
  formatTime,
  handleDeviceSelection,
  pausePlayback,
  playNext,
  playPrev,
  playTrack,
  resumePlayback,
  seekTrack,
  spotifyLogin,
} from "@/lib/spotify/utils";
import { ImCross } from "react-icons/im";
import {
  IoMusicalNote,
  IoPauseOutline,
  IoPlayOutline,
  IoSearch,
} from "react-icons/io5";
import { Slider } from "../ui/slider";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import { RiLoopLeftLine } from "react-icons/ri";
import { GiDove, GiSpeaker } from "react-icons/gi";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MdDevices } from "react-icons/md";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useState } from "react";
import Api from "@/api";
import { MusicLeftProps, Track } from "@/properties/interfaces/spotify";

const MusicLeft = ({
  current_track,
  playbackPosition,
  trackDuration,
  is_paused,
  setPaused,
  activeDevices,
  isLoggedIn,
}: MusicLeftProps) => {
  const [volume] = useState(50);
  const [toggleSearch, settoggleSearch] = useState(false);
  const [searchInput, setsearchInput] = useState("");
  const [searchedTracks, setsearchedTracks] = useState<Track[] | null>(null);

  const searchSong = async () => {
    if (toggleSearch) {
      settoggleSearch(false);
    } else {
      settoggleSearch(true);
      const response = await Api.post("/spotify/search", { name: searchInput });
      setsearchedTracks(response?.data?.data.tracks);
    }
  };

  const handlePlay = async (track: Track) =>
    playTrack(track?.uri, "Searched Track").then(() => {
      setsearchInput("");
      settoggleSearch(false);
    });
  return (
    <div id="music-left" className="w-full h-full md:w-1/2 bg-primary">
      <div className="bg-neutral-800 rounded-xl p-6 transition-all">
        <div className={`relative ${toggleSearch ? "mb-6" : "mb-0"}`}>
          <input
            type="text"
            value={searchInput}
            placeholder="Search for music..."
            className="w-full bg-neutral-700 text-white rounded-lg
            pl-10 md:pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setsearchInput(e?.target?.value)}
          />
          <IoMusicalNote className="w-5 h-5 absolute left-3 top-3.5 text-neutral-400" />
          <Button
            onClick={searchSong}
            className="px-2 py-0 absolute right-3 top-1.5 text-xs"
          >
            {!toggleSearch ? <IoSearch /> : <ImCross />}
          </Button>
        </div>

        {!toggleSearch ? (
          <div>
            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GiDove className="text-6xl text-green-500 mb-4" />
                <h3 className="text-white text-xl font-semibold mb-3">
                  Spotify Premium Required
                </h3>
                <p className="text-neutral-400 mb-6">
                  Login to access music controls
                </p>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center"
                  onClick={spotifyLogin}
                >
                  <IoMusicalNote className="mr-2" /> Connect Spotify
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-neutral-700/30 rounded-xl p-4 my-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-neutral-600 rounded-lg flex-shrink-0">
                      <img
                        src={current_track?.album?.images[0]?.url}
                        alt="Album cover"
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white text-sm md:text-xl font-semibold">
                        {current_track?.name || "Not Playing"}
                      </h4>
                      <p className="text-neutral-400 text-sm">
                        {current_track?.artists?.[0].name || "No Artist"}
                      </p>
                    </div>
                  </div>

                  <div className="md:mb-4">
                    <div className="relative w-full h-1 bg-neutral-600 rounded">
                      <Slider
                        value={[
                          Math.floor(
                            (playbackPosition / trackDuration) * 100
                          ) || 0,
                        ]}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          seekTrack(value, trackDuration);
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>{formatTime(playbackPosition)}</span>
                      <span>{formatTime(trackDuration)}</span>
                    </div>
                  </div>

                  <div className="flex justify-center items-center space-x-6">
                    <button
                      className="text-neutral-400 hover:text-white text-xl md:text-3xl transition-colors"
                      onClick={playPrev}
                    >
                      <TbPlayerTrackPrev />
                    </button>
                    <button
                      className="bg-blue-500 text-white rounded-full text-xl md:text-3xl p-4 hover:bg-blue-600 transition-colors"
                      onClick={
                        is_paused
                          ? () => resumePlayback(setPaused)
                          : () => pausePlayback(setPaused)
                      }
                    >
                      {is_paused ? <IoPlayOutline /> : <IoPauseOutline />}
                    </button>
                    <button
                      type="button"
                      className="text-neutral-400 hover:text-white text-xl md:text-3xl transition-colors"
                      onClick={playNext}
                    >
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
                    <div className="bg-neutral-600 w-32 rounded-lg ">
                      <Slider
                        onValueChange={(value) => changeVolume(value[0])}
                        defaultValue={[volume]}
                        max={100}
                        step={1}
                      />
                    </div>
                  </div>
                  <div className="text-neutral-400 text-3xl hover:text-white transition-colors">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className=" bg-transparent border-none"
                      >
                        <Button variant="default">
                          <MdDevices />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-56  rounded-3xl p-4 text-xs"
                        side="top"
                        sideOffset={5}
                        avoidCollisions={true}
                        collisionPadding={10}
                      >
                        <DropdownMenuLabel>Select Device</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {activeDevices &&
                            activeDevices.map((device) => (
                              <DropdownMenuItem
                                key={device.id}
                                onClick={() => handleDeviceSelection(device)}
                              >
                                {device.name}{" "}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 h max-h-[300px] overflow-y-scroll">
            {searchedTracks &&
              searchedTracks.map((track: Track) => (
                <div
                  onClick={() => handlePlay(track)}
                  key={track.id}
                  className="flex items-center p-3 rounded-lg  transition-colors cursor-pointer 
          
              bg-neutral-700/30 hover:bg-neutral-700/50"
                >
                  <div className="rounded-md w-8 h-8 md:w-12 md:h-12 bg-neutral-600 md:rounded-xl flex-shrink-0">
                    <img
                      className="rounded-md md:rounded-xl object-center"
                      //@ts-ignore
                      src={track?.image}
                      alt={`${track?.name || "Track"} cover`}
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h4 className="text-white text-sm">{track?.name}</h4>
                    <p className="text-neutral-400 text-xs">{track?.artists}</p>
                  </div>
                  <span className="text-neutral-400 text-sm">
                    {track?.duration}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicLeft;
