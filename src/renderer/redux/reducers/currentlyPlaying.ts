/**
 * Represents the currently playing song
*/
import Song from '../../types/Song';

// action type strings
export const CHANGE_CURRENTLY_PLAYING = 'CHANGE_CURRENTLY_PLAYING';

// action type interface
export interface ChangeCurrentlyPlayingAction {
  type: 'CHANGE_CURRENTLY_PLAYING';
  song: Song;
}

// initial state, has to be something
const initialSong = new Song({
  songTitle: 'n/a', artistName: 'n/a', albumArt: 'n/a', isPlaying: false,
});

// reducer
export default function currentlyPlaying(state = initialSong,
  action: ChangeCurrentlyPlayingAction): Song {
  switch (action.type) {
    case CHANGE_CURRENTLY_PLAYING:
      return action.song;
    default:
      return state;
  }
}
