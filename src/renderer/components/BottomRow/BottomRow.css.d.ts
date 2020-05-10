declare namespace BottomRowCssModule {
  export interface IBottomRowCss {
    "bottom-row": string;
    bottomRow: string;
  }
}

declare const BottomRowCssModule: BottomRowCssModule.IBottomRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BottomRowCssModule.IBottomRowCss;
};

export = BottomRowCssModule;
