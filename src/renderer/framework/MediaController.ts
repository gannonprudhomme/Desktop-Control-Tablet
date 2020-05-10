import Song from '../types/Song';

/**
 * The abstract interface represting how Media can be controlled.
 * Currently only implemented by SpotifyController
 */
export default interface MediaController {
  nextSong(): void;
  playPause(): void;
  previousSong(): void;
  getSong(): Promise<Song>;
}
