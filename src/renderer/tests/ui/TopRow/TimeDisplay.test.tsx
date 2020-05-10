import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TimeDisplay from '../../../components/TopRow/TimeDisplay/TimeDisplay';

describe('TimeDisplay', () => {
  test('renders the current time correctly', () => {
    // arrange
    const { getByText } = render(
      <TimeDisplay />,
    );

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12; // the hour 0 should be '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    const expected = `${hours}:${minutesStr} ${ampm}`;

    // act
    const found = getByText(expected);

    // assert
    expect(found).toBeTruthy();
  });
});
