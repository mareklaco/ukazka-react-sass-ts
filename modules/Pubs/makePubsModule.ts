import {makeActions, makeActionTypes} from "./actions";
import {makeReducer, makeSelectors} from "./reducer";
import {makePubs} from "./Pubs";
import {makeModules} from "./modules";
import {devLog} from "../../functions";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makePubsModule(prefix:string, moduleState:Function) {
  devLog('makePubsModule()', prefix);
  const actionTypes = makeActionTypes(prefix)
  const modules = makeModules(prefix, moduleState)
  const selectors = makeSelectors(moduleState, modules)
  const actions = makeActions(actionTypes, selectors, modules)
  return {

    reducer: makeReducer(actionTypes, modules),

    //public components
    mainComponent: 'Pubs',
    Pubs: makePubs(selectors, actions, modules),

    //public selectors (return all, or a subsert)
    //...selectors
    isFewPubs: selectors.isFewPubs,

    //public actions (return all, or a subset)
    //...actions,

    //public actionTypes (return all, or a subset)
    //...actionTypes
  }
}
