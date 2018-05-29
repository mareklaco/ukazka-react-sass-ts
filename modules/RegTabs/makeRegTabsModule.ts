import {makeReducer,} from "./reducer";
import {makeModules} from "./modules";
import {makeRegTab} from "./RegTabs";
import {devLog} from "../../functions";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makeRegTabsModule(prefix:string, moduleState:Function) {
  devLog('makeRegTabsModule()', prefix);
  const modules = makeModules(prefix, moduleState)
  return {

    reducer: makeReducer(modules),

    //public components
    mainComponent: 'RegTabs',
    RegTabs: makeRegTab(modules),

  }
}
