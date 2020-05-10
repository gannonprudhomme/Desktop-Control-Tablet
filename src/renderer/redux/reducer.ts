// The main/root reducer for the project
import { combineReducers } from 'redux';
import currentlyPlaying from './reducers/currentlyPlaying';

const dctReducer = combineReducers({
  currentlyPlaying,
});

export default dctReducer;
export type RootState = ReturnType<typeof dctReducer>;