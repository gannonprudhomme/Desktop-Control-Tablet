import { createStore } from 'redux';
import dctReducer from '../../redux/reducer';
import { addModule, changeCurrentModule, setModulesArray } from '../../redux/actions/modules';

describe('modules Redux', () => {
  describe('addModule', () => {
    test('adds a module to modulesArray', () => {
      // arrange
      const store = createStore(dctReducer);
      const module = {
        component: null as React.FC,
        icon: '',
        name: '',
        reducer: null as Function,
        serverRequired: false,
        index: 0,
      };

      // act
      store.dispatch(addModule(module));

      // assert
      const { modulesArray } = store.getState().modules;
      expect(modulesArray).toContain(module);
    });
  });

  describe('setModulesArray', () => {
    test('works correctly', () => {
      // arrange
      const store = createStore(dctReducer);
      const module = {
        component: null as React.FC,
        icon: '',
        name: '',
        reducer: null as Function,
        serverRequired: false,
        index: 0,
      };

      // act
      store.dispatch(setModulesArray([module]));

      // assert
      const { modulesArray } = store.getState().modules;
      expect(modulesArray).toEqual([module]);
    });
  });

  describe('changeCurrentModule', () => {
    test('sets the current module', () => {
      const store = createStore(dctReducer);
      const module = {
        component: null as React.FC,
        icon: '',
        name: '',
        reducer: null as Function,
        serverRequired: false,
        index: 0,
      };


      // act
      store.dispatch(changeCurrentModule(module));

      // assert
      const { currentModule } = store.getState().modules;
      expect(currentModule).toEqual(module);
    });
  });
});
