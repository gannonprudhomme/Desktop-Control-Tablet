// The main/root reducer for the project
import { combineReducers } from 'redux';
import currentlyPlaying from './reducers/currentlyPlaying';
import volumeProcesses from '../modules/VolumeMixer/reducer';
import modules from './reducers/modules';

const dctReducer = combineReducers({
  currentlyPlaying,
  modules,
  volumeProcesses,
});

export default dctReducer;
export type RootState = ReturnType<typeof dctReducer>;
