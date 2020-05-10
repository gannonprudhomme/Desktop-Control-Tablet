declare namespace MediaControlCssModule {
  export interface IMediaControlCss {
    "image-button": string;
    imageButton: string;
    "next-song": string;
    nextSong: string;
    "play-pause": string;
    playPause: string;
    "playback-container": string;
    playbackContainer: string;
    "previous-song": string;
    previousSong: string;
    "spotify-playback": string;
    spotifyPlayback: string;
  }
}

declare const MediaControlCssModule: MediaControlCssModule.IMediaControlCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MediaControlCssModule.IMediaControlCss;
};

export = MediaControlCssModule;
