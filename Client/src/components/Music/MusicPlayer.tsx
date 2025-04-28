import Api from "@/api";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";

import { GiSpeaker } from "react-icons/gi";
import { IoPlayOutline, IoPauseOutline, IoSearch } from "react-icons/io5";
import { PiMusicNotes } from "react-icons/pi";
import { RiLoopLeftLine } from "react-icons/ri";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import {
  spotifyLogin,
  playNext,
  playPrev,
  changeVolume,
  pausePlayback,
  resumePlayback,
  seekTrack,
  formatTime
} from "@/lib/spotify/utils"
import { MdDevices } from "react-icons/md";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface MusicPlayerProps {
  token: string;
}
const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};
const MusicPlayer = ({ token }: MusicPlayerProps) => {


  const [volume, setvolume] = useState(50);
  const [is_paused, setPaused] = useState(true);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const pollingTimerRef = useRef<any>(null);
  // Add this ref to keep track of the timer
  const progressTimerRef = useRef(null);
  useEffect(() => {
    if (token) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: "Desk sarthi",
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        // Save the player instance to component state
        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener("ready", async ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          try {
            // Just transfer to this device, but don't start playing yet
            await Api.post("/spotify/transfer-playback", { device_id });
            console.log("Playback started on current device");
          } catch (error) {
            console.error("Failed to transfer playback:", error);
          }
        });

        spotifyPlayer.addListener("player_state_changed", (state) => {
          if (state) {
            console.log("Player state changed:", state);
            setTrack(state.track_window.current_track);
            setPlaybackPosition(state.position);
            setTrackDuration(state.duration);
            setPaused(state.paused);
          }
        });

        // Connect and handle errors properly
        spotifyPlayer
          .connect()
          .then((success) => {
            if (success) {
              console.log(
                "The Web Playback SDK successfully connected to Spotify!"
              );
            }
          })
          .catch((err) => {
            console.error("Failed to connect to Spotify:", err);
          });
      };

      return () => {
        if (player) {
          player.disconnect();
        }
      };
    }
  }, [token]);
 // Polling Spotify API for playback state
 useEffect(() => {
  const fetchPlaybackState = async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setTrack(data.item);
          setPlaybackPosition(data.progress_ms);
          setTrackDuration(data.item.duration_ms);
          setPaused(!data.is_playing);
        }
      }
    } catch (error) {
      console.error("Failed to fetch playback state:", error);
    }
  };

  if (token) {
    pollingTimerRef.current = setInterval(fetchPlaybackState, 3000);
  }

  return () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
  };
}, [token]);
 //useEffect to handle the timer updates
  useEffect(() => {
    // Clean up any existing timer
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }

    // Only run timer when track is playing
    if (!is_paused && trackDuration > 0) {
      const startTime = Date.now();
      const startPosition = playbackPosition;

      progressTimerRef.current = setInterval(() => {
        // Calculate elapsed time since timer started
        const elapsed = Date.now() - startTime;
        const currentPosition = Math.min(
          startPosition + elapsed,
          trackDuration
        );
        setPlaybackPosition(currentPosition);

        // Stop timer if we reach the end
        if (currentPosition >= trackDuration) {
          clearInterval(progressTimerRef.current);
        }
      }, 100); // Update every 100ms for smooth visuals
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [is_paused, playbackPosition, trackDuration]);


  return (
    <div className="bg-secondary grid grid-cols-1 md:grid-cols-2 md:flex text-primary w-full gap-8 p-2">
      <div id="music-left" className="w-full md:w-1/2 bg-primary">
        <div className="bg-neutral-800 rounded-xl p-6 transition-all">
          <button
            className="bg-red-400 p-2 rounded mb-4"
            onClick={spotifyLogin}
          >
            "Login to Spotify"
          </button>

          <div className="relative mb-6">
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
              <div className="w-10 h-10 md:w-16 md:h-16 bg-neutral-600 rounded-lg flex-shrink-0">
                <img
                  src={current_track?.album.images[0].url}
                  alt="Album cover"
                  className="w-full h-full rounded-lg"
                />
              </div>
              <div className="ml-4">
                <h4 className="text-white font-semibold">
                  {current_track?.name || "Not Playing"}
                </h4>
                <p className="text-neutral-400 text-sm">
                  {current_track?.artists[0].name || "No Artist"}
                </p>
              </div>
            </div>

            <div className="md:mb-4">
              <div className="relative w-full h-1 bg-neutral-600 rounded">
                <Slider
                  value={[
                    Math.floor((playbackPosition / trackDuration) * 100) || 0,
                  ]}
                  max={100}
                  step={1}
                  onValueChange={(value) => {seekTrack(value,trackDuration) }}
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
                onClick={is_paused ?()=> resumePlayback(setPaused) :()=> pausePlayback(setPaused)}
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

            <DropdownMenu >
      <DropdownMenuTrigger  asChild className=" bg-transparent border-none">
        <Button variant="default"> <MdDevices /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56  rounded-3xl p-4 text-xs"
         side="top"
         sideOffset={5}
         avoidCollisions={true}
         collisionPadding={10}
      >
        <DropdownMenuLabel>Select Device</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

           
            </div>
          </div>
        </div>
      </div>

      {/* Keep the rest of your component as is */}
      <div id="music-right" className="w-full md:w-1/2 bg-primary">
        <div className="bg-neutral-800 rounded-xl h-full p-6 transition-all">
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
