declare namespace ModuleSwitcherCssModule {
  export interface IModuleSwitcherCss {
    "control-container": string;
    controlContainer: string;
    "toggle-button": string;
    toggleButton: string;
    "view-swapper": string;
    viewSwapper: string;
  }
}

declare const ModuleSwitcherCssModule: ModuleSwitcherCssModule.IModuleSwitcherCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ModuleSwitcherCssModule.IModuleSwitcherCss;
};

export = ModuleSwitcherCssModule;
