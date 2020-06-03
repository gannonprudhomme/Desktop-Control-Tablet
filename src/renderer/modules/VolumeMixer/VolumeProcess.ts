interface VolumeProcessInit {
  processID: number;
  name: string; // process name
  volume: number;
  dominantColor: string; // hex value for the dominant color
}

/**
 * Represents a process on the desktop server that has audio control
 */
export default class VolumeProcess {
  processID: number;
  name: string;
  volume: number;
  dominantColor: string;

  constructor(init: VolumeProcessInit) {
    if (init.volume < 0 || init.volume > 100) {
      throw Error(`Volume must be in the range [0, 100]! Is ${init.volume}`);
    }

    Object.assign(this, init);
  }
}
