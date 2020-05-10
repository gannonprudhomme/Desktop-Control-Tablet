import * as SocketIOClient from 'socket.io-client';
import SpotifyController from './SpotifyController';

export const socket = SocketIOClient('http://localhost:3000');
export const spotifyController = new SpotifyController(socket);
