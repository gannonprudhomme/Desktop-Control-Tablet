declare namespace TrackDisplayCssModule {
  export interface ITrackDisplayCss {
    "album-cover": string;
    albumCover: string;
    "current-artist": string;
    "current-track": string;
    currentArtist: string;
    currentTrack: string;
    track: string;
    "track-info": string;
    trackInfo: string;
  }
}

declare const TrackDisplayCssModule: TrackDisplayCssModule.ITrackDisplayCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TrackDisplayCssModule.ITrackDisplayCss;
};

export = TrackDisplayCssModule;
