import {ITabmenuTab} from "./interfaces";


export const ActionTypes = {
  SET_TAB: '',
  EXPAND: '',
  COLLAPSE: '',
}

export const makeActionTypes = (prefix:string):typeof ActionTypes => {
  return Object.keys(ActionTypes).reduce((o, key) => ({...o, [key]: prefix + '/' + key}), {}) as (typeof ActionTypes)
}

export const makeActions = (actionTypes:typeof ActionTypes) => {
  return {
    setTabAction: (tab:ITabmenuTab) => {
      return (dispatch) => {
        dispatch({
          type: actionTypes.SET_TAB,
          tab,
        })
      }
    },
    expandAction: () => {
      return (dispatch) => {
        dispatch({
          type: actionTypes.EXPAND
        })
      }
    },
    collapseAction: () => {
      return (dispatch) => {
        dispatch({
          type: actionTypes.COLLAPSE
        })
      }
    }
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let a = true ? undefined : makeActions(makeActionTypes(''))
export type ActionsType = typeof a;
