import * as React from 'react';
import * as ReactDom from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import dctReducer from './redux/reducer';

const mainElement = document.createElement('div');
mainElement.style.cssText = 'height: 100%;';
document.body.appendChild(mainElement);

const store = createStore(dctReducer);

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  mainElement,
);
