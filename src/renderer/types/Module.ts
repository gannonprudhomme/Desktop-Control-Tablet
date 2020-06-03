/**
 * Abstract representation of a Module
 * A module represents the
 */
export interface Module {
  // The component to be rendered in the MiddleRow
  component: React.FC; // Probably?
  icon: string; // URL to the icon? Used for ModuleSwitcher
  name: string;
  reducer: Function; // Used to add the logic to the reducer
  serverRequired: boolean; // Whether this is dependent on a connection to the server or not
  index: number; // The original index it's loaded in at to order the ModuleSwitcher correctly
  // actions?
}

export interface ServerModule extends Module {
  socket: SocketIOClient.Socket;
}

interface ModuleArrayInit {
  modulesArray: Module[];
  disabledModules: Module[];
  currentModule: Module;
}

/**
 * The type that's stored by Redux for managing modules
 */
export default class ModuleArray {
  modulesArray: Module[];
  currentModule: Module; // The module that's currently being display in MiddleRow
  disabledModules: Module[];

  constructor(init: ModuleArrayInit) {
    if (init.modulesArray == null) {
      throw Error(`modulesArray cannot be null! ${init.modulesArray}`);
    }

    Object.assign(this, init);
  }
}
