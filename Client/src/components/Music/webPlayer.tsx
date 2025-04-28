import Api from "@/api";
import { useState, useEffect } from "react";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback(props) {
  const [is_paused, setPaused] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    if (props.token) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
          name: "Desk sarthi",
          getOAuthToken: (cb) => {
            cb(props.token);
          },
          volume: 1.0,
        });

        // Save the player instance to component state
        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener("ready", async ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          try {
            // Just transfer to this device, but don't start playing yet
            const response = await fetch(
              "https://api.spotify.com/v1/me/player",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${props.token}`,
                },
                body: JSON.stringify({
                  device_ids: [device_id],
                  play: false, // Set to false to avoid errors
                }),
              }
            );
console.log("Playback started on current device");
          

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Playback transferred to current device");
          } catch (error) {
            console.error("Failed to transfer playback:", error);
          }
        });

        spotifyPlayer.addListener("player_state_changed", (state) => {
          if (state) {
            console.log("Player state changed:", state);
            setTrack(state.track_window.current_track);
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
  }, [props.token]);

  const spotifyLogin = async () => {
    try {
      const response = await Api.get("/spotify/login", {
        withCredentials: true,
      });

      if (response.data && response.data.authUrl) {
        console.log("Redirecting to Spotify login");
        window.location.href = response.data.authUrl;
      } else {
        console.error("No auth URL provided");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="container">
        <button onClick={spotifyLogin}>Login</button>

        <div className="main-wrapper">
          <img
            src={current_track?.album.images[0].url}
            className="now-playing__cover"
            alt="image"
          />

          <div className="now-playing__side">
            <div className="now-playing__name">{current_track?.name}</div>
            <div className="now-playing__artist">
              {current_track?.artists[0].name}
            </div>

            <button
              className="btn-spotify bg-blue-400 mr-2"
              onClick={() => {
                if (player) player.previousTrack();
              }}
            >
              previou
            </button>

            <button
              className="btn-spotify"
              onClick={() => {
                if (player) player.togglePlay();
              }}
            >
              {is_paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className="btn-spotify bg-pink-500"
              onClick={() => {
                if (player) player.nextTrack();
              }}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebPlayback;
