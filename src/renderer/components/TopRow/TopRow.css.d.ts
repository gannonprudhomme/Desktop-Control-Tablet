declare namespace TopRowCssModule {
  export interface ITopRowCss {
    "top-row": string;
    topRow: string;
  }
}

declare const TopRowCssModule: TopRowCssModule.ITopRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TopRowCssModule.ITopRowCss;
};

export = TopRowCssModule;
