declare namespace VolumeSliderCssModule {
  export interface IVolumeSliderCss {
    slider: string;
    "slider-container": string;
    "slider-icon": string;
    "slider-info-container": string;
    "slider-label": string;
    sliderContainer: string;
    sliderIcon: string;
    sliderInfoContainer: string;
    sliderLabel: string;
  }
}

declare const VolumeSliderCssModule: VolumeSliderCssModule.IVolumeSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VolumeSliderCssModule.IVolumeSliderCss;
};

export = VolumeSliderCssModule;
