import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import dctReducer from '../../../redux/reducer';
import Song from '../../../types/Song';
import MediaControl from '../../../components/BottomRow/MediaControl/MediaControl';

describe('MediaControl', () => {
  describe('calls the correct MediaController method', () => {
    test('when play/pause button is pressed', () => {
      // arrange
      const store = createStore(dctReducer);

      const mockedPlayPause = jest.fn();
      const mockedMediaController = {
        playPause: mockedPlayPause,

        nextSong: jest.fn(),
        previousSong: jest.fn(),
        getSong(): Promise<Song> {
          return Promise.resolve(null as Song);
        },
      };

      const { getByTestId } = render(
        <Provider store={store}>
          <MediaControl mediaController={mockedMediaController} />
        </Provider>,
      );

      // act
      fireEvent.click(getByTestId('playPauseButton'));

      // assert
      expect(mockedPlayPause).toHaveBeenCalledTimes(1);
    });

    test('when next-song button is pressed', () => {
      // arrange
      const store = createStore(dctReducer);

      const mockedNextSong = jest.fn();
      const mockedMediaController = {
        nextSong: mockedNextSong,

        playPause: jest.fn(),
        previousSong: jest.fn(),
        getSong(): Promise<Song> {
          return Promise.resolve(null as Song);
        },
      };

      const { getByTestId } = render(
        <Provider store={store}>
          <MediaControl mediaController={mockedMediaController} />
        </Provider>,
      );

      // act
      fireEvent.click(getByTestId('nextSongButton'));

      // assert
      expect(mockedNextSong).toHaveBeenCalledTimes(1);
    });

    test('when previous-song is pressed', () => {
      // arrange
      const store = createStore(dctReducer);

      const mockedPreviousSong = jest.fn();
      const mocked = {
        previousSong: mockedPreviousSong,
        nextSong: jest.fn(),
        playPause: jest.fn(),
        getSong(): Promise<Song> {
          return Promise.resolve(null as Song);
        },
      };

      const { getByTestId } = render(
        <Provider store={store}>
          <MediaControl mediaController={mocked} />
        </Provider>,
      );

      // act
      fireEvent.click(getByTestId('previousSongButton'));

      // assert
      expect(mockedPreviousSong).toHaveBeenCalledTimes(1);
    });
  });
});
