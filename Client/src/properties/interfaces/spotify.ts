export interface Track {
    id: string;
    name: string;
    artists: string;
    image: {
      url: string;
    };
    duration: string;
    uri: string;
  }
 export interface MusicPlayerProps {
    token: string;
    setToken: any;
    isLoggedIn:boolean
  }
 export interface MusicLeftProps {
    current_track: {
      name: string;
      album: {
        images: { url: string }[];
      };
      artists: { name: string }[];
    };
    playbackPosition: number;
    trackDuration: number;
    is_paused: boolean;
    isLoggedIn: boolean;
    setPaused: React.Dispatch<React.SetStateAction<boolean>>;
    activeDevices:
      | {
          id: string;
          name: string;
          is_active: boolean;
          type: string;
        }[]
      | null;
  }
  