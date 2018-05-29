import {makeTabmenuModule} from "../Tabmenu";
import {makePubsModule} from "../Pubs";


export const makeModules = (prefix:string, moduleState:Function) => {
  return {
    Tabmenu: makeTabmenuModule(prefix + '/Tabmenu', (state) => moduleState(state).Tabmenu),
    Pubs: makePubsModule(prefix + '/Pubs', (state) => moduleState(state).Pubs)
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let m = true ? undefined : makeModules(null, null)
export type ModulesType = typeof m
