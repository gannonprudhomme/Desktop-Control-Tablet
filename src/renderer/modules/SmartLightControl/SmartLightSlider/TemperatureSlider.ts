// I'm moving this outside

export function getSliderColor(type: string, value: number): string {
  switch (type) {
    case 'hue': {
      // const adjusted = value * 3.6;
      const adjusted = value;

      return `${adjusted}`;
    }
    case 'kelvin':
      return '';
    default:
      return '';
  }
}

export function otherStuff(): void {
  const thing = 5;
}
