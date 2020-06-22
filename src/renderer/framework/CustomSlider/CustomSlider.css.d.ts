declare namespace CustomSliderCssModule {
  export interface ICustomSliderCss {
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

declare const CustomSliderCssModule: CustomSliderCssModule.ICustomSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CustomSliderCssModule.ICustomSliderCss;
};

export = CustomSliderCssModule;
