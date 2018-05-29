import {makeActions, makeActionTypes} from "./actions";
import {makeReducer, makeSelectors} from "./reducer";
import {makePubsByBeer} from "./PubsByBeer";
import {makeModules} from "./modules";
import {devLog} from "../../functions";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makePubsByBeerModule(prefix:string, moduleState:Function) {
  devLog('makePubsByBeerModule()', prefix);
  const actionTypes = makeActionTypes(prefix)
  const modules = makeModules(prefix, moduleState)
  const selectors = makeSelectors(moduleState, modules)
  const actions = makeActions(actionTypes, selectors, modules)
  return {

    reducer: makeReducer(actionTypes, modules),

    //public components
    mainComponent: 'PubsByBeer',
    PubsByBeer: makePubsByBeer(selectors, actions, modules),

    //public selectors (return all, or a subsert)
    //...selectors

    //public actions (return all, or a subset)
    //...actions,

    //public actionTypes (return all, or a subset)
    //...actionTypes
  }
}
