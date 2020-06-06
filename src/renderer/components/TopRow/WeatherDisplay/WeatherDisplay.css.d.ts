declare namespace WeatherDisplayCssModule {
  export interface IWeatherDisplayCss {
    temperature: string;
    "temperature-weather-container": string;
    temperatureWeatherContainer: string;
    "weather-container": string;
    "weather-icon": string;
    weatherContainer: string;
    weatherIcon: string;
  }
}

declare const WeatherDisplayCssModule: WeatherDisplayCssModule.IWeatherDisplayCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WeatherDisplayCssModule.IWeatherDisplayCss;
};

export = WeatherDisplayCssModule;
