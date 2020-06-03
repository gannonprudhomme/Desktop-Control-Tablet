/**
 * Handles anything related to Spotify controlling
 */

import { Socket } from 'socket.io';
import * as SocketIOClient from 'socket.io-client';
import MediaController from './MediaController';
import Song from '../types/Song';
import socket from './SocketHandler';

/**
 * Handles anything related to communicating with Spotify
 */
export default class SpotifyController implements MediaController {
  socket: SocketIOClient.Socket;
  currentlyPlaying: Song;

  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;
    this.currentlyPlaying = new Song({
      songTitle: 'N/A',
      artistName: 'n/a',
      albumArt: 'n/a',
      isPlaying: false,
    });

    // Make us authenticate if we haven't already
  }

  getSong(): Promise<Song> {
    return new Promise<Song>((res) => {
      this.socket.emit('get_track', null, (data: any) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const { track, artist, album_image, is_playing } = data;

        const ret = new Song({
          songTitle: track, artistName: artist, albumArt: album_image, isPlaying: is_playing,
        });

        this.currentlyPlaying = ret;

        res(ret);

        // Handles the date stuff?
      });
    });
  }

  playPause(): void {
    if (this.currentlyPlaying.isPlaying) {
      this.socket.emit('pause');
    } else {
      this.socket.emit('play');
    }
  }

  nextSong(): void {
    this.socket.emit('next');
  }

  previousSong(): void {
    this.socket.emit('previous');
  }
}

export const spotifyController = new SpotifyController(socket);
