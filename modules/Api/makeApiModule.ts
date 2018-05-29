import {makeActions, makeActionTypes} from "./actions";
import {makeReducer, makeSelectors} from "./reducer";
import {devLog} from "../../functions";
import {makeStatusMessages} from "./StatusMessages";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makeApiModule(prefix:string, moduleState:Function) {
  devLog('makeApiModule()', prefix);
  const actionTypes = makeActionTypes(prefix)
  const selectors = makeSelectors(moduleState)
  const actions = makeActions(actionTypes, selectors)
  return {

    reducer: makeReducer(actionTypes),

    //public components
    StatusMessages: makeStatusMessages(selectors),

    //public selectors (return all, or a subsert)
    ...selectors,

    //public actions (return all, or a subset)
    //...actions,
    requestAction: actions.requestAction,

    //public actionTypes (return all, or a subset)
    //...actionTypes
    RECIEVE: actionTypes.RECIEVE,
    LOADING_TOO_LONG: actionTypes.LOADING_TOO_LONG,
    ERROR_LOADING: actionTypes.ERROR_LOADING,
  }
}
