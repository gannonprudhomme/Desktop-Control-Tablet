import { CHANGE_CURRENTLY_PLAYING, ChangeCurrentlyPlayingAction } from '../reducers/currentlyPlaying';
import Song from '../../types/Song';

/**
 * Changes the currently playing song
 * Called from MediaControl
 */
export default function changeCurrentlyPlaying(song: Song): ChangeCurrentlyPlayingAction {
  return {
    type: CHANGE_CURRENTLY_PLAYING,
    song,
  };
}
