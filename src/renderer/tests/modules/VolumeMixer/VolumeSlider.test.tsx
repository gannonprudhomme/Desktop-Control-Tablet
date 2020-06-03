import * as React from 'react';
import { render } from '@testing-library/react';
import VolumeSlider from '../../../modules/VolumeMixer/VolumeSlider/VolumeSlider';
import VolumeProcess from '../../../modules/VolumeMixer/VolumeProcess';

describe('VolumeSlider', () => {
  test('renders without errors', () => {
    // arrange
    const volumeProcess = new VolumeProcess({
      processID: 0,
      name: '',
      volume: 100,
      dominantColor: '#fff',
    });

    // act
    const container = render(<VolumeSlider volumeProcess={volumeProcess} />);

    // assert
    expect(container).toBeTruthy();
  });

  test('shows the current volume', () => {
    // arrange
    const volumeProcess = new VolumeProcess({
      processID: 0,
      name: '',
      volume: 30,
      dominantColor: '#fff',
    });

    // act
    const { getByText } = render(<VolumeSlider volumeProcess={volumeProcess} />);

    // assert
    expect(getByText('30%')).toBeInTheDocument();
  });

  /* test('changes the volume on slide', () => {
    // arrange
    jest.mock('@material-ui/core/Slider', () => (props: any): any => {
      const {
        id, name, min, max, onChange, testid,
      } = props;
      return (
        <input
          data-testid={testid}
          type="range"
          id={id}
          name={name}
          min={min}
          max={max}
          onChange={(event): void => onChange(event.target.value)}
        />
      );
    });

    VolumeMixerSockets.volumeMixerSockets.setVolume = jest.fn();

    const volumeProcess = new VolumeProcess({
      processID: 0,
      name: 'Process',
      volume: 100,
      dominantColor: '#f',
    });

    const { getByTestId } = render(<VolumeSlider volumeProcess={volumeProcess} />);

    // act
    fireEvent.change(getByTestId('Process-slider'), 30);

    // assert
    const { setVolume } = VolumeMixerSockets.volumeMixerSockets;
    expect(setVolume).toHaveBeenCalledWith(0, 0);
  }); */
});
