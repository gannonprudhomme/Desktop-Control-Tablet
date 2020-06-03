declare namespace VolumeMixerCssModule {
  export interface IVolumeMixerCss {
    "volume-mixer": string;
    volumeMixer: string;
  }
}

declare const VolumeMixerCssModule: VolumeMixerCssModule.IVolumeMixerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VolumeMixerCssModule.IVolumeMixerCss;
};

export = VolumeMixerCssModule;
