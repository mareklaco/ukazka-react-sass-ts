import {makeActions, makeActionTypes} from "./actions";
import {makeReducer, makeSelectors} from "./reducer";
import {makeTabmenu} from "./Tabmenu";
import {devLog} from "../../functions";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makeTabmenuModule(prefix:string, moduleState:Function) {
  devLog('makeTabmenuModule()', prefix);
  const actionTypes = makeActionTypes(prefix)
  const actions = makeActions(actionTypes)
  const selectors = makeSelectors(moduleState as any)
  return {

    reducer: makeReducer(actionTypes),

    //public components
    mainComponent: 'Tabmenu',
    Tabmenu: makeTabmenu(selectors, actions),

    //public selectors (return all, or a subsert)
    ...selectors,

    //public actions (return all, or a subset)
    // ...actions,
    setTabAction: actions.setTabAction,

    //public actionTypes (return all, or a subset)
    //...actionTypes
  }
}
