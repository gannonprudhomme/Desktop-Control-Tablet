declare namespace SmartLightSliderCssModule {
  export interface ISmartLightSliderCss {
    "light-name": string;
    lightName: string;
    "lights-slider-container": string;
    lightsSliderContainer: string;
    "override-slider-container": string;
    overrideSliderContainer: string;
    "smart-light-slider-container": string;
    smartLightSliderContainer: string;
  }
}

declare const SmartLightSliderCssModule: SmartLightSliderCssModule.ISmartLightSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SmartLightSliderCssModule.ISmartLightSliderCss;
};

export = SmartLightSliderCssModule;
