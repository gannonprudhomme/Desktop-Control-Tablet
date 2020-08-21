declare namespace SmartLightControlCssModule {
  export interface ISmartLightControlCss {
    "smart-light-container": string;
    smartLightContainer: string;
  }
}

declare const SmartLightControlCssModule: SmartLightControlCssModule.ISmartLightControlCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SmartLightControlCssModule.ISmartLightControlCss;
};

export = SmartLightControlCssModule;
