import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import App from '../../components/App';

describe('App', () => {
  test('renders without errors', () => {
    // arrange / act
    const container = render(<App />);

    // assert
    expect(container).toBeTruthy();
  });
});
