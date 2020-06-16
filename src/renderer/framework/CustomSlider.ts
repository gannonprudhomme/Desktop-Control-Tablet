import { Slider, withStyles } from '@material-ui/core';

const thumbSize = 36;
const CustomSlider = withStyles({
  root: {
    color: '#999999',
    width: '8px !important',
  },
  thumb: {
    width: thumbSize,
    height: thumbSize,
    // Change this to use the dominant color of the program icon
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    // marginTop: '0px !important',
    marginLeft: '-12px !important',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  // idek what this
  track: {
    width: '12px !important',
    borderRadius: 4,
  },
  rail: {
    width: '12px !important',
    borderRadius: 4,
  },
})(Slider);

export default CustomSlider;
