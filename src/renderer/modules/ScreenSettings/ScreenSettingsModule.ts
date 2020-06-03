import * as React from 'react';
import { Module } from '../../types/Module';
import ScreenSettings from './ScreenSettings';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const icon = require('../../../../public/assets/settings.png');

export default class ScreenSettingsModule implements Module {
  component: React.FC;
  icon: string;
  name: string;
  reducer: Function;
  serverRequired: boolean;
  index: number;

  constructor() {
    this.component = ScreenSettings;
    this.icon = icon.default;
    this.name = 'ScreenSettings';
    this.reducer = null;
    this.serverRequired = false;
  }
}

// Combine the reducers again?
