import * as React from 'react';
import { createStore } from 'redux';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import dctReducer from '../../../redux/reducer';
import ModuleSwitcher from '../../../components/BottomRow/ModuleSwitcher/ModuleSwitcher';
import { addModule } from '../../../redux/actions/modules';

describe('ModuleSwitcher', () => {
  test('renders without errors', () => {
    // arrange
    const store = createStore(dctReducer);

    // Add an initial module so the bulk of the component is rendered
    const module = {
      name: 'Module1',
      component: null as React.FC,
      icon: null as string,
      reducer: null as Function,
    };
    store.dispatch(addModule(module));

    // act
    const container = render(
      <Provider store={store}>
        <ModuleSwitcher />
      </Provider>,
    );

    // assert
    expect(container).toBeTruthy();
  });

  describe('changes the current module', () => {
    test('when a module button is selected', () => {
      // arrange
      const store = createStore(dctReducer);

      const module1 = {
        name: 'Module1',
        component: null as React.FC,
        icon: null as string,
        reducer: null as Function,
      };
      const module2 = {
        ...module1,
        name: 'Module2',
      };
      store.dispatch(addModule(module1));
      store.dispatch(addModule(module2));

      const { getByTestId } = render(
        <Provider store={store}>
          <ModuleSwitcher />
        </Provider>,
      );

      // act
      const module2Button = getByTestId('Module2-button');
      fireEvent.click(module2Button);

      // assert
      const { currentModule } = store.getState().modules;
      expect(currentModule).toEqual(module2);
    });
  });
});
