import Api from "@/api";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Spotify: {
      Player: new (options: any) => any;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// Define Spotify namespace
namespace Spotify {
  export interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(eventName: string, callback: (state: any) => void): void;
    getCurrentState(): Promise<any>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }
}

import {

  filterUniqueDevices,
} from "@/lib/spotify/utils";


import MusicRight from "./MusicRight";
import MusicLeft from "./MusicLeft";

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
interface Track {
  id: string;
  name: string;
  artists: string;
  image: {
    url: string;
  };
  duration: string;
  uri: string;
}

const MusicPlayerLayout = ({ token }: MusicPlayerProps) => {
  const [is_paused, setPaused] = useState(true);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [current_track, setCurrentTrack] = useState(track);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const pollingTimerRef = useRef<any>(null);
  const [activeDevices, setactiveDevices] = useState<any[] | null>(null);
  const [userPlaylists, setuserPlaylists] = useState(null);
  const [tracks, setTracks] = useState<Track[] | null>(null);
  // Add this ref to keep track of the timer
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (token) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: "Desk sarthi",
          getOAuthToken: (cb: (token: string) => void) => {
            cb(token);
          },
          volume: 0.5,
        });
        setPlayer(spotifyPlayer as any);

        spotifyPlayer.addListener(
          "ready",
          async ({ device_id }: { device_id: string }) => {
            try {
              await Api.post("/spotify/transfer-playback", { device_id });
            } catch (error: any) {
              console.error("Failed to transfer playback:", error?.message);
            }
          }
        );

        spotifyPlayer.addListener("player_state_changed", (state: any) => {
          if (state) {
            setCurrentTrack(state.track_window.current_track);
            setPlaybackPosition(state.position);
            setTrackDuration(state.duration);
            setPaused(state.paused);
          }
        });

        // Connect and handle errors properly
        spotifyPlayer
          .connect()
          .then(async (success: boolean) => {
            if (success) {
              // Filter devices with unique names using reduce
              try {
                const devices = await Api.get("/spotify/getMydevices");
                const filteredDevices = filterUniqueDevices(
                  devices?.data?.data
                );
                setactiveDevices(filteredDevices);
              } catch (error: any) {
                console.log("Unable to filter devices", error?.message);
              }
              // Get Users playlists
              try {
                const userPlaylists = await Api.get(
                  "/spotify/getUserPlaylists"
                );
                setuserPlaylists(userPlaylists?.data?.data?.data);
              } catch (error: any) {
                console.log("Unable to get userPlaylists", error?.message);
              }
              // Get users Saved songs
              try {
                const savedSongs = await Api.get("/spotify/getSavedSongs");
                setTracks(savedSongs.data.data);
              } catch (error: any) {
                console.log("Unable to get Saved songs", error?.message);
              }
            }
          })
          .catch((err: Error) => {
            console.error("Failed to connect to Spotify:", err);
          });
      };
      return () => {
        player?.disconnect();
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
            setCurrentTrack(data.item);
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
          clearInterval(progressTimerRef.current!);
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
    <div className="bg-secondary grid grid-cols-1 md:grid-cols-2 md:flex text-primary w-full h-full gap-8 p-2">
      <MusicLeft 
      current_track={current_track}
      is_paused={is_paused}
      playbackPosition={playbackPosition}
      setPaused={setPaused}
      trackDuration={trackDuration}
      activeDevices={activeDevices}
       />

      <MusicRight
        userPlaylists={userPlaylists}
        tracks={tracks}
        setTracks={setTracks}
        current_track={current_track}
      />
    </div>
  );
};

export default MusicPlayerLayout;
