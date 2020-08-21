import * as React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import {
  makeStyles, Theme,
} from '@material-ui/core';
import CustomSlider from '../../../../framework/CustomSlider/CustomSlider';

interface HueSliderProps {
  lightHue: number;
  onChange: (value: number) => void;
}

// TODO: Need a way to update the hue in here if it changes in the light externally

/**
 *  A material-ui slider that has a gradient background
 */
const HueSlider: React.FC<HueSliderProps> = ({ lightHue, onChange }) => {
  const [hue, setHue] = React.useState(lightHue);

  const minHue = 0;
  const maxHue = 355; // Really this should be 360

  React.useEffect(() => {
    setHue(lightHue);
  }, [lightHue]);

  interface HueSliderStyleProps {
    thumbColor: string;
  }

  const useHueSliderStyles = makeStyles<Theme, HueSliderStyleProps>(() => ({
    thumb: (props): CSSProperties => ({
      backgroundColor: `${props.thumbColor}`,
      // width: 16,
      // height: 16,
    }),
    track: {
      // Hide the track so that the rainbow-gradient rail is the only thing that's shown
      opacity: 0,
    },
    rail: {
      // Make this slightly transparent so the colors aren't as strong
      opacity: 0.9,
      background: `-webkit-gradient(linear, left top, left bottom, 
                                    from(#f00),
                                    color-stop(0.17, #ff0),
                                    color-stop(0.33, #0f0),
                                    color-stop(0.5, #0ff),
                                    color-stop(0.67, #00f),
                                    color-stop(0.83, #f0f),
                                    to(#f00));`,
    },
  }));

  const classes = useHueSliderStyles({ thumbColor: `hsl(${maxHue - hue}, 100%, 50%)` });

  return (
    <CustomSlider
      orientation="vertical"
      min={minHue}
      max={maxHue}
      value={hue}
      classes={{ thumb: classes.thumb, rail: classes.rail, track: classes.track }}
      onChange={(event, value): void => {
        event.preventDefault();

        const hueVal = Number(value);
        setHue(hueVal);
        onChange(hueVal);
      }}
    />
  );
};

export default HueSlider;
