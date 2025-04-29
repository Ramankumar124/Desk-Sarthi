import { getPlaylistTracks, playTrack } from "@/lib/spotify/utils";
import { Select } from "@radix-ui/react-select";
import { useState } from "react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Track } from "@/properties/interfaces/spotify";


interface Playlist {
  id: string;
  name: string;
}
interface MusicRightProps {
    userPlaylists: Playlist[] | null;
    tracks: Track[] | null;
    setTracks: React.Dispatch<React.SetStateAction<Track[] | null>>;
    current_track: {
      name: string;
      album: {
        images: { url: string; }[];
      };
      artists: { name: string; }[];
    };
  }

const MusicRight = ({ userPlaylists, tracks, setTracks,current_track }: MusicRightProps) => {
  const [active_playlist, setActivePlaylist] = useState<Playlist | null>(null);

  return (
    <div id="music-right" className="w-full md:w-1/2   h-max-[400px]   ">
      <div className="bg-neutral-800 rounded-xl h-full p-6 transition-all">
        <Select
          onValueChange={(value) => {
            // Find the selected playlist by name to get its ID
            const selectedPlaylist = userPlaylists?.find(
              (playlist) => playlist.name === value
            );
            setActivePlaylist(selectedPlaylist || null);
            if (selectedPlaylist) {
              getPlaylistTracks(selectedPlaylist.id, setTracks);
            }
          }}
        >
          <SelectTrigger className="w-auto text-white border-none">
            <SelectValue placeholder="Liked Songs" className="text-white" />
          </SelectTrigger>
          <SelectContent>
            {userPlaylists &&
              userPlaylists.map((playlist) => (
                <SelectItem key={playlist.id} value={playlist.name}>
                  {playlist.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className=" overflow-y-scroll max-h-[350px]">
          {tracks &&
            tracks.map((track) => (
              <div
                onClick={() => playTrack(track?.uri, active_playlist?.id ||null)}
                key={track.id}
                className={`flex items-center p-3 rounded-lg  transition-colors cursor-pointer ${
                  track.name === current_track?.name
                    ? "bg-green-700/40 hover:bg-green-700/25"
                    : "bg-neutral-700/30 hover:bg-neutral-700/50"
                }`}
              >
                <div className="rounded-md w-8 h-8 md:w-12 md:h-12 bg-neutral-600 md:rounded-xl flex-shrink-0">
                  <img
                    className="rounded-md md:rounded-xl object-center"
                    src={track.image.url}
                    alt="image"
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
      </div>
    </div>
  );
};

export default MusicRight;
