import * as React from 'react';
import { createStore } from 'redux';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import VolumeMixer from '../../../modules/VolumeMixer/VolumeMixer';
import dctReducer from '../../../redux/reducer';
import VolumeProcess from '../../../modules/VolumeMixer/VolumeProcess';
import updateVolumeProcesses from '../../../modules/VolumeMixer/action';

describe('VolumeMixer', () => {
  // idek what to test
  test('renders the volume sliders', () => {
    // arrange
    const store = createStore(dctReducer);

    const volumeProcess1 = new VolumeProcess({
      processID: 0,
      name: 'Process1',
      volume: 100,
      dominantColor: '#fff',
    });

    store.dispatch(updateVolumeProcesses([volumeProcess1]));

    // act
    const { getByTestId } = render(
      <Provider store={store}>
        <VolumeMixer />
      </Provider>,
    );

    // assert
    expect(getByTestId('Process1-slider')).toBeInTheDocument();
  });
});
