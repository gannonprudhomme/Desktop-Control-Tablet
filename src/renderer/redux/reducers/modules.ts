/**
 * Represents all of the modules in the project
 */

import ModuleArray, { Module } from '../../types/Module';
// import { defaultModule, currentModules } from '../../modules/ModulesManager';

// action type strings
export const ADD_MODULE = 'ADD_MODULE';
export const SET_MODULES_ARRAY = 'SET_MODULES_ARRAY';
export const CHANGE_CURRENT_MODULE = 'CHANGE_CURRENT_MODULE';
export const SHOW_SERVER_REQUIRED_MODULES = 'SHOW_SERVER_REQUIRED_MODULES';
export const HIDE_SERVER_REQUIRED_MODULES = 'HIDE_SERVER_REQUIRED_MODULES';

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

export interface ShowServerRequiredModulesAction {
  type: 'SHOW_SERVER_REQUIRED_MODULES';
}

export interface HideServerRequiredModulesAction {
  type: 'HIDE_SERVER_REQUIRED_MODULES';
}

export type ModuleAction = AddModuleAction | ChangeCurrentModuleAction | SetModulesArrayAction
                           | ShowServerRequiredModulesAction | HideServerRequiredModulesAction;

// Load the modules here

// Why does this have to be here? We could call it upon state instantiation (in main reducer.ts??)
const initialState = new ModuleArray({
  modulesArray: [], currentModule: null, disabledModules: [],
});

export default function modules(state: ModuleArray = initialState,
  action: ModuleAction): ModuleArray {

  const serverModules = state.modulesArray.filter((module) => module.serverRequired);
  const nonServerModules = state.modulesArray.filter((module) => !module.serverRequired);
  let { currentModule } = state;

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
    case SHOW_SERVER_REQUIRED_MODULES:
      return {
        ...state,
        // Sort it so it's always in the same order, regardless of the desktop connection
        modulesArray: [...state.modulesArray, ...state.disabledModules].sort(
          (a, b) => a.index - b.index, // ascending order
        ),
        disabledModules: [],
      };
    case HIDE_SERVER_REQUIRED_MODULES:
      if (state.currentModule && state.currentModule.serverRequired) {
        currentModule = nonServerModules.length > 0 ? nonServerModules[0] : null;
      }

      return {
        ...state,
        modulesArray: nonServerModules,
        disabledModules: serverModules,
        currentModule,
      };
    default:
      return state;
  }
}
