/**
 * Handles anything related to Spotify controlling
 */

import { Socket } from 'socket.io';
import * as SocketIOClient from 'socket.io-client';
import MediaController from './MediaController';
import Song from '../types/Song';

/**
 * Handles anything related to communicating with Spotify
 */
export default class SpotifyController implements MediaController {
  socket: SocketIOClient.Socket;

  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;

    // Make us authenticate if we haven't already
  }

  getSong(): Promise<Song> {
    return new Promise<Song>((res) => {
      this.socket.emit('get_track', null, (data: any) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { track, artist, album_image } = data;

        // eslint-disable-next-line @typescript-eslint/camelcase
        res(new Song({ songTitle: track, artistName: artist, albumArt: album_image }));

        // Handles the date stuff?
      });
    });
  }

  playPause(): void {
    this.socket.emit('play');
  }

  nextSong(): void {
    this.socket.emit('next');
  }

  previousSong(): void {
    this.socket.emit('previous');
  }
}
