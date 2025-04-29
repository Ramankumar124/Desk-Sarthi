import Api from "@/api";
import { Track } from "@/properties/interfaces/spotify";

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
const playNext = async () => {
  try {
    await Api.get("/spotify/next");
  } catch (error) {
    console.error("Error playing next track:", error);
  }
};
const playPrev = async () => {
  try {
    await Api.get("/spotify/previous");
  } catch (error) {
    console.error("Error playing previous track:", error);
  }
};
const changeVolume = async (value: number) => {
  try {
    await Api.post("/spotify/volume", { value });
  } catch (error) {
    console.error("Error changing volume:", error);
  }
};
const pausePlayback = async (
  setPaused: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setPaused(true);
  try {
    await Api.get("/spotify/pause");
  } catch (error: any) {
    console.log(error);
  }
};
const resumePlayback = async (
  setPaused: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setPaused(false);
  try {
    await Api.get("/spotify/resume");
  } catch (error: any) {
    console.log(error);
  }
};
const seekTrack = async (value: any, trackDuration: number) => {
  const newPosition = Math.floor((value[0] / 100) * trackDuration);
  await Api.post("/spotify/seekPlayBack", { newPosition });
};
const handleDeviceSelection = async (device: any) => {
  await Api.post("/spotify/transfer-playback", { device_id: device.id });
};
// Helper function to format time in MM:SS
const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
const filterUniqueDevices = (devices: any[]): any[] => {
  return devices.reduce((unique: any[], device: any) => {
    const existingDevice = unique.find((d) => d.name === device.name);
    if (!existingDevice) {
      unique.push(device);
    }
    return unique;
  }, []);
};
const getPlaylistTracks = async (
  id: string,
  setTracks: React.Dispatch<React.SetStateAction<Track[] | null>>
) => {
  const response = await Api.post("/spotify/getPlaylistTracks", { id });
  console.log("playlist songs", response.data.data);
  setTracks(response?.data?.data);
};
const playTrack = async (id: string, playListid: string | null) => {
  if (playListid = "Searched Track") {
    await Api.post("/spotify/play", { uri:id });
  } else if (playListid) {
    await Api.post("/spotify/play", { uri:id, playListid });
  } else {
    await Api.post("/spotify/playSaveSongs", { trackId: id });
  }
};
export {
  spotifyLogin,
  playNext,
  playPrev,
  changeVolume,
  pausePlayback,
  resumePlayback,
  seekTrack,
  formatTime,
  handleDeviceSelection,
  getPlaylistTracks,
  playTrack,
  filterUniqueDevices,
};
