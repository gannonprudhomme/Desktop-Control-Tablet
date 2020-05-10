import { render } from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import dctReducer from '../../../redux/reducer';
import TrackDisplay from '../../../components/BottomRow/TrackDisplay/TrackDisplay';
import changeCurrentlyPlaying from '../../../redux/actions/currentlyPlaying';
import Song from '../../../types/Song';

describe('TrackDisplay', () => {
  test('renders without errors', () => {
    // arrange
    const store = createStore(dctReducer);

    // act
    const container = render(
      <Provider store={store}>
        <TrackDisplay />
      </Provider>,
    );

    // assert
    expect(container).toBeTruthy();
  });

  test('display the current song correctly', () => {
    // arrange
    const store = createStore(dctReducer);
    const songTitle = 'Polygon Dust';
    const artistName = 'Porter Robinson';
    const song = new Song({
      songTitle, artistName, albumArt: 'url', isPlaying: false,
    });

    store.dispatch(changeCurrentlyPlaying(song));

    // act
    const { getByText } = render(
      <Provider store={store}>
        <TrackDisplay />
      </Provider>,
    );

    const artistText = getByText(artistName);
    const songText = getByText(songTitle);

    // assert
    expect(artistText).toBeTruthy();
    expect(songText).toBeTruthy();
  });
});
