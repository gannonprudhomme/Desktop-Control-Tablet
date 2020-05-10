import { createStore } from 'redux';
import dctReducer from '../../redux/reducer';
import changeCurrentlyPlaying from '../../redux/actions/currentlyPlaying';
import Song from '../../types/Song';

describe('currentlyPlaying Redux', () => {
  test('sets the currently playing song correctly', () => {
    // arrange
    const store = createStore(dctReducer);
    const song = new Song({ songTitle: 'title', artistName: 'name', albumArt: 'url' });

    // act
    store.dispatch(changeCurrentlyPlaying(song));
    const result = store.getState().currentlyPlaying;

    // assert
    expect(result).toEqual(song);
  });
});
