import { useEffect, useState } from "react";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

interface PlayerProps {
  token: string;
}

export default function SpotifyPlayer({ token }: PlayerProps) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const newPlayer = new window.Spotify.Player({
          name: "My Next.js Spotify Player",
          getOAuthToken: (cb: any) => cb(token),
          volume: 0.5,
        });

        newPlayer.connect();
        setPlayer(newPlayer);
      };
    };
  }, [token]);

  return <div>Spotify Web Player Initialized</div>;
}
