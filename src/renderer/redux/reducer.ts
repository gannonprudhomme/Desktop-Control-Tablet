// The main/root reducer for the project
import { combineReducers } from 'redux';
import currentlyPlaying from './reducers/currentlyPlaying';
import modules from './reducers/modules';

const dctReducer = combineReducers({
  currentlyPlaying,
  modules,
});

export default dctReducer;
export type RootState = ReturnType<typeof dctReducer>;
