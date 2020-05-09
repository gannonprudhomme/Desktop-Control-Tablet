import * as React from 'react';
import * as ReactDom from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

ReactDom.render(
  <App />,
  mainElement
);