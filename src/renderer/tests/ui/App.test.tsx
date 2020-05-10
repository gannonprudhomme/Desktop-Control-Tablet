import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import App from '../../components/App';
import dctReducer from '../../redux/reducer';

describe('App', () => {
  test('renders without errors', () => {
    // arrange / act
    const store = createStore(dctReducer);

    const container = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    // assert
    expect(container).toBeTruthy();
  });
});
