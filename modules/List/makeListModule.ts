import {makeActions, makeActionTypes} from "./actions";
import {makeReducer, makeSelectors} from "./reducer";
import {makeList} from "./List";
import {makeModules} from "./modules";
import {devLog} from "../../functions";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makeListModule(prefix:string, moduleState:Function, apiId:string) {
  devLog('makeListModule()', prefix);
  const actionTypes = makeActionTypes(prefix)
  const modules = makeModules(prefix, moduleState)
  const selectors = makeSelectors(moduleState, modules)
  const actions = makeActions(actionTypes, selectors, modules, apiId)
  return {

    reducer: makeReducer(actionTypes, modules),

    //public components
    mainComponent: 'List',
    List: makeList(selectors, actions, modules),

    //public selectors (return all, or a subsert)
    //...selectors

    //public actions (return all, or a subset)
    //...actions,

    //public actionTypes (return all, or a subset)
    //...actionTypes
  }
}
