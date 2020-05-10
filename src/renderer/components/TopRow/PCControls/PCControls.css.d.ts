declare namespace PcControlsCssModule {
  export interface IPcControlsCss {
    "pc-controls": string;
    "pc-controls-button": string;
    pcControls: string;
    pcControlsButton: string;
  }
}

declare const PcControlsCssModule: PcControlsCssModule.IPcControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PcControlsCssModule.IPcControlsCss;
};

export = PcControlsCssModule;
