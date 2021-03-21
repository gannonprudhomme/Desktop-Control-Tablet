declare namespace CommonStylesCssModule {
  export interface ICommonStylesCss {
    "default-icon": string;
    defaultIcon: string;
    "image-button": string;
    imageButton: string;
  }
}

declare const CommonStylesCssModule: CommonStylesCssModule.ICommonStylesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CommonStylesCssModule.ICommonStylesCss;
};

export = CommonStylesCssModule;
