declare namespace VolumeSliderCssModule {
  export interface IVolumeSliderCss {
    "process-name-text": string;
    processNameText: string;
  }
}

declare const VolumeSliderCssModule: VolumeSliderCssModule.IVolumeSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VolumeSliderCssModule.IVolumeSliderCss;
};

export = VolumeSliderCssModule;
