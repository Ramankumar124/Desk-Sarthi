import { Router } from "express";
import {
  activeDevices,
  callbackSpotify,
  changeVolume,
  getAccessToken,
  getCurrentSong,
  getSavedSongs,
  loginSpotify,
  pausePlayback,
  playlistTracks,
  playSavedSongs,
  playTrack,
  resumePlayback,
  searchTrack,
  seekPlayBack,
  skipToNext,
  skipToPrevious,
  transferPlayback,
  userPlaylist,
} from "../controller/music.controller";
import { isAuthenticated } from "../middleware/spotify.middleware";

const router = Router();
router.route("/login").get(loginSpotify);
router.route("/callback").get(callbackSpotify);

// Music playback control routes
router.route("/search").post(isAuthenticated,searchTrack)
router.route("/play").post(isAuthenticated,playTrack);
router.route("/resume").get(isAuthenticated,resumePlayback);
router.route("/pause").get(isAuthenticated,pausePlayback);
router.route("/next").get(isAuthenticated,skipToNext);
router.route("/previous").get(isAuthenticated,skipToPrevious);
router.route("/volume").post(isAuthenticated,changeVolume);
router.route("/getCurrentState").get(isAuthenticated,getCurrentSong);
router.route("/accessToken").get(isAuthenticated,getAccessToken);
router.route("/transfer-playback").post(isAuthenticated,transferPlayback);
router.route("/seekPlayBack").post(isAuthenticated,seekPlayBack);
router.route("/getMydevices").get(isAuthenticated,activeDevices);
router.route("/getUserPlaylists").get(isAuthenticated,userPlaylist);
router.route("/getPlayListTracks").post(isAuthenticated,playlistTracks);
router.route("/getSavedSongs").get(isAuthenticated,getSavedSongs);
router.route("/playSaveSongs").post(isAuthenticated,playSavedSongs);

export { router as spotifyRoutes };
