import * as React from 'react';
import { createStore } from 'redux';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import dctReducer from '../../redux/reducer';
import { addModule, changeCurrentModule } from '../../redux/actions/modules';
import MiddleRow from '../../components/MiddleRow/MiddleRow';

describe('MiddleRow UI', () => {
  describe('changes the currently displaying module', () => {
    test('when the currentModule state changes', async () => {
      // arrange
      const module1Comp: React.FC = () => (<div> Module1 </div>);
      const module2Comp: React.FC = () => (<div> Module2 </div>);

      const store = createStore(dctReducer);
      const module1 = {
        name: 'Module1',
        component: module1Comp,
        icon: null as string,
        reducer: null as Function,
        serverRequired: false,
        index: 0,
      };
      const module2 = {
        ...module1,
        name: 'Module2',
        component: module2Comp,
      };
      store.dispatch(addModule(module1));
      store.dispatch(addModule(module2));
      store.dispatch(changeCurrentModule(module1));

      const { findByText } = render(
        <Provider store={store}>
          <MiddleRow />
        </Provider>,
      );

      // act
      await findByText('Module1'); // First ensure that Module1 text is there

      // then actually change the module
      store.dispatch(changeCurrentModule(module2));

      // assert
      const module2Text = await findByText('Module2');
      expect(module2Text).toBeInTheDocument();
    });
  });

  describe('hides the desktop-server modules', () => {
    test('when the desktop connection is lost', () => {
      // arrange

      // act

      // asert
    });
  });
});
