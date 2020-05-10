declare namespace TimeDisplayCssModule {
  export interface ITimeDisplayCss {
    time: string;
  }
}

declare const TimeDisplayCssModule: TimeDisplayCssModule.ITimeDisplayCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TimeDisplayCssModule.ITimeDisplayCss;
};

export = TimeDisplayCssModule;
