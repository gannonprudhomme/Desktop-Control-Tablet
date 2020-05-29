/**
 * Represents all of the modules in the project
 */

import ModuleArray, { Module } from '../../types/Module';
// import { defaultModule, currentModules } from '../../modules/ModulesManager';

// action type strings
export const ADD_MODULE = 'ADD_MODULE';
export const SET_MODULES_ARRAY = 'SET_MODULES_ARRAY';
export const CHANGE_CURRENT_MODULE = 'CHANGE_CURRENT_MODULE';

// action type interfaces
export interface AddModuleAction {
  type: 'ADD_MODULE';
  module: Module;
}

export interface SetModulesArrayAction {
  type: 'SET_MODULES_ARRAY';
  modules: Module[];
}

export interface ChangeCurrentModuleAction {
  type: 'CHANGE_CURRENT_MODULE';
  currentModule: Module;
}

export type ModuleAction = AddModuleAction | ChangeCurrentModuleAction | SetModulesArrayAction;

// Load the modules here

// Why does this have to be here? We could call it upon state instantiation (in main reducer.ts??)
const initialState = new ModuleArray({
  modulesArray: [], currentModule: null,
});

export default function modules(state: ModuleArray = initialState,
  action: ModuleAction): ModuleArray {
  switch (action.type) {
    case ADD_MODULE:
      return {
        ...state,
        modulesArray: [...state.modulesArray, action.module],
      };
    case SET_MODULES_ARRAY:
      return {
        ...state,
        modulesArray: [...state.modulesArray, ...action.modules],
      };
    case CHANGE_CURRENT_MODULE:
      // TODO: Should we check if currentModule is in ModulesArray?
      return {
        ...state,
        currentModule: action.currentModule,
      };
    default:
      return state;
  }
}
