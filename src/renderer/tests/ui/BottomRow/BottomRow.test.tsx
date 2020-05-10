import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import dctReducer from '../../../redux/reducer';
import BottomRow from '../../../components/BottomRow/BottomRow';

describe('BottomRow', () => {
  test('renders without errors', () => {
    // arrange
    const store = createStore(dctReducer);

    // act
    const container = render(
      <Provider store={store}>
        <BottomRow />
      </Provider>,
    );

    // assert
    expect(container).toBeTruthy();
  });
});
