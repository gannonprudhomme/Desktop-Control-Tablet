declare namespace MiddleRowCssModule {
  export interface IMiddleRowCss {
    "middle-row": string;
    middleRow: string;
  }
}

declare const MiddleRowCssModule: MiddleRowCssModule.IMiddleRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MiddleRowCssModule.IMiddleRowCss;
};

export = MiddleRowCssModule;
