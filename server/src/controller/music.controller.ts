import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/Asynchandler";
import SpotifyWebApi from "spotify-web-api-node";
import "express-session";
import { ApiResponse } from "../utils/ApiResponse";
import { log } from "winston";
import { generateRandomString } from "../utils/RandomStrings";

declare module "express-session" {
  interface SessionData {
    spotifyState?: string;
  }
}

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
});

const scopes = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-modify-playback-state",
  "user-read-playback-state",
  "user-read-currently-playing",
  "app-remote-control",
  "user-library-read",
  "user-library-modify",
  "playlist-modify-private",
  "playlist-modify-public",
  "playlist-read-collaborative",
  "user-top-read",
  "user-read-recently-played",
];

// LOGIN: Generate auth URL
const loginSpotify = asyncHandler(async (req: Request, res: Response) => {
  const state = generateRandomString(16);

  // Make sure to create the session if it doesn't exist
  req.session.spotifyState = state;

  // Force session save before redirecting
  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      return res.status(500).json({ error: "Session error" });
    }

    const authUrl = spotifyApi.createAuthorizeURL(scopes, state);
    res.json({ authUrl });
  });
});

// CALLBACK: Spotify redirects here after login
const callbackSpotify = asyncHandler(async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };

  if (state !== req.session.spotifyState) {
    return res.status(400).send("State mismatch");
  }

  const data = await spotifyApi.authorizationCodeGrant(code);
  const accessToken = data.body["access_token"];
  const refreshToken = data.body["refresh_token"];
  console.log("access token", accessToken);
  console.log("refresh token", refreshToken);

  // Save in secure cookies
  res.cookie("spotifyAccessToken", accessToken, {
    httpOnly: true,
    secure: true, // true in production
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("spotifyRefreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(process.env.CLIENT_URL!);
});

// PLAY TRACK
const playTrack = asyncHandler(async (req: Request, res: Response) => {
  const { uri, playlistId } = req.body;

  try {
    if (playlistId) {
      // Play track in the context of a playlist
      await spotifyApi.play({
        context_uri: `spotify:playlist:${playlistId}`,
        offset: { uri: uri },
      });
    } else {
      // Play single track without playlist context
      await spotifyApi.play({
        uris: [uri],
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Track playing successfully"));
  } catch (error) {
    console.error("Failed to play track:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Failed to play track"));
  }
});
const playSavedSongs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { trackId } = req.body;
    const savedTracks = await spotifyApi.getMySavedTracks({ limit: 50 });
    const uris = savedTracks.body.items.map((item) => item.track.uri);
    const startIndex = uris.findIndex((uri) => uri.includes(trackId));

    if (startIndex === -1) {
      console.log("Track not found in liked songs");
      return;
    }

    await spotifyApi.play({
      uris: uris,
      offset: { position: startIndex },
    });
  }
);
const searchTrack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const response = await spotifyApi.searchTracks(name, { limit: 10 });

    const tracks = response.body.tracks?.items.map((track) => ({
      id: track.id,
      name: track.name,
      uri: track.uri,
      artist: track.artists[0]?.name,
      image: track.album.images[0]?.url || null,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, { tracks }, "Tracks found successfully"));
  }
);

const pausePlayback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await spotifyApi.pause();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "⏸️ Playback paused successfully"));
  }
);
const resumePlayback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await spotifyApi.play();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "⏸️ Playback resumed successfully"));
  }
);
const skipToNext = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await spotifyApi.skipToNext();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "⏭️ Skipped to next track"));
  }
);

const skipToPrevious = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await spotifyApi.skipToPrevious();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "⏮️ Returned to previous track"));
  }
);
const changeVolume = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { value } = req.body;
    console.log("value aye", value);

    await spotifyApi.setVolume(value);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "⏮️ Returned to previous track"));
  }
);

const getAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from cookies
    const token = req.cookies.spotifyAccessToken;

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "No access token available"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { token }, "Access token retrieved successfully")
      );
  }
);

const transferPlayback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { device_id } = req.body;

    console.log("body a ", req.body);
    await spotifyApi.transferMyPlayback([device_id]);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "⏮️ plackback transfered"));
  }
);

const seekPlayBack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPosition } = req.body;
    await spotifyApi.seek(newPosition);
  }
);
const getCurrentSong = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let data;
    const playbackState = await spotifyApi.getMyCurrentPlaybackState();

    if (playbackState.body && playbackState.body.item) {
      const { is_playing, item } = playbackState.body;
      const trackName = item.name;
      //@ts-ignore
      const artist = item.artists[0].name;
      //@ts-ignore

      const albumImage = item.album.images[0]?.url; // Highest-res image

      console.log(`Track: ${trackName} (${is_playing ? "Playing" : "Paused"})`);
      console.log(`Artist: ${artist}`);
      console.log(`Album Cover: ${albumImage}`);

      data = {
        track: trackName,
        artist,
        image: albumImage,
        isPlaying: is_playing,
        progressMs: playbackState.body.progress_ms,
      };
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { data }, "⏮️ Returned to previous track"));
  }
);

const activeDevices = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await spotifyApi.getMyDevices();
    const devices = data.body.devices;
    return res
      .status(200)
      .json(new ApiResponse(200, devices, "devices sended successfuly"));
  }
);

const userPlaylist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const me = await spotifyApi.getMe();
    const userId = me.body.id;
    const playlists = await spotifyApi.getUserPlaylists(userId, {
      limit: 50,
      offset: 0,
    });
    const data = playlists.body.items;
    return res
      .status(200)
      .json(
        new ApiResponse(200, { data }, "user playlist sended successfully")
      );
  }
);

const playlistTracks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    let offset = 0;
    const limit = 100; // Max allowed per request
    const response = await spotifyApi.getPlaylistTracks(id, {
      limit,
      offset,
      fields:
        "items(track(id,name,artists(name),album(images),duration_ms,uri))",
    });

    const tracks = await response.body.items.map((item) => {
      const track = item.track;
      const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };

      return {
        id: track?.id,
        name: track?.name,
        uri: track?.uri,
        artists: track?.artists
          ?.slice(0, 2)
          .map((artist) => artist.name)
          .join(", "),
        duration: formatDuration(track?.duration_ms!),
        image: track?.album.images[0] || null,
      };
    });
    return res
      .status(200)
      .json(new ApiResponse(200, tracks, "Playlist data sended successufully"));
  }
);
const getSavedSongs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = 50; // Max number of items per request
    const offset = 0;

    const response = await spotifyApi.getMySavedTracks({
      limit,
      offset,
    });

    const tracks = response.body.items.map((item) => {
      const track = item.track;
      const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      };

      return {
        id: track.id,
        name: track.name,
        uri: track.uri,
        artists: track.artists
          .slice(0, 2)
          .map((artist) => artist.name)
          .join(", "),
        duration: formatDuration(track.duration_ms),
        image: track.album.images[0] || null,
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, tracks, "Saved tracks retrieved successfully")
      );
  }
);
const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the refresh token from cookies
      const refreshToken = req.cookies.spotifyRefreshToken;

      if (!refreshToken) {
        return res
          .status(401)
          .json(new ApiResponse(401, {}, "No refresh token available"));
      }

      // Set the refresh token in the API instance
      spotifyApi.setRefreshToken(refreshToken);

      // Request a new access token
      const data = await spotifyApi.refreshAccessToken();
      const newAccessToken = data.body["access_token"];

      // Update the API instance with the new token
      spotifyApi.setAccessToken(newAccessToken);

      // Save the new access token in a cookie
      res.cookie("spotifyAccessToken", newAccessToken, {
        httpOnly: true,
        secure: true, // true in production
        sameSite: "lax",
        maxAge: 3600 * 1000, // 1 hour
      });

      console.log("Access token refreshed successfully");

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            newAccessToken,
            "Access token refreshed successfully"
          )
        );
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Failed to refresh access token"));
    }
  }
);

export {
  loginSpotify,
  callbackSpotify,
  searchTrack,
  playTrack,
  pausePlayback,
  resumePlayback,
  skipToNext,
  skipToPrevious,
  changeVolume,
  getCurrentSong,
  transferPlayback,
  getAccessToken,
  seekPlayBack,
  activeDevices,
  userPlaylist,
  playlistTracks,
  getSavedSongs,
  playSavedSongs,
  refreshAccessToken,
};
