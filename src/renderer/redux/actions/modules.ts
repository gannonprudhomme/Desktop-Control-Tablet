import {
  CHANGE_CURRENT_MODULE, ADD_MODULE, AddModuleAction, ChangeCurrentModuleAction,
  SetModulesArrayAction, SET_MODULES_ARRAY,
} from '../reducers/modules';
import { Module } from '../../types/Module';

export function addModule(module: Module): AddModuleAction {
  return {
    type: ADD_MODULE,
    module,
  };
}

export function setModulesArray(modules: Module[]): SetModulesArrayAction {
  return {
    type: SET_MODULES_ARRAY,
    modules,
  };
}

export function changeCurrentModule(currentModule: Module): ChangeCurrentModuleAction {
  return {
    type: CHANGE_CURRENT_MODULE,
    currentModule,
  };
}
