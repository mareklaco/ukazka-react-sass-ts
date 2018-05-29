import {SelectorsType} from "./reducer";
import {ModulesType} from "./modules";


declare var process:any

export const ActionTypes = {
  SET_REG_ID: '',
  RESET_STATE: '',
}

export const makeActionTypes = (prefix:string):typeof ActionTypes => {
  return Object.keys(ActionTypes).reduce((o, key) => ({...o, [key]: prefix + '/' + key}), {}) as (typeof ActionTypes)
}


export const makeActions = (actionTypes:typeof ActionTypes, selectors:SelectorsType, modules:ModulesType) => {


  const resetStateAction = () => {
    return {
      type: actionTypes.RESET_STATE,
    }
  }

  const setRegIdAction = (regId:number) => {
    return {
      type: actionTypes.SET_REG_ID,
      regId
    }
  }

  const makeRequestParams = (state) => {
    return {
      //api
      a: 'PubsByType',
      r: selectors.getRegId(state),
    }
  }

  const requestFiltersAction = () => {
    return (dispatch:Function, getState) => {
      dispatch(
        modules.Api.requestAction(makeRequestParams(getState()))
      )
    }
  }

  return {
    resetStateAction,
    setRegIdAction,
    requestFiltersAction
  }

}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let a = true ? undefined : makeActions(makeActionTypes(''), null, null)
export type ActionsType = typeof a;
