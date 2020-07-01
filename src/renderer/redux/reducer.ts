// The main/root reducer for the project
import { combineReducers } from 'redux';
import currentlyPlaying from './reducers/currentlyPlaying';
import volumeProcesses from '../modules/VolumeMixer/reducer';
import modules from './reducers/modules';
import smartLights from '../modules/SmartLightControl/reducer';

const dctReducer = combineReducers({
  currentlyPlaying,
  modules,

  // Custom modules
  volumeProcesses,
  smartLights,
});

export default dctReducer;
export type RootState = ReturnType<typeof dctReducer>;
