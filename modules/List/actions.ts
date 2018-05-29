import {IListProps, IListResponse} from "./interfaces";
import {ModulesType} from "./modules";
import {SelectorsType} from "./reducer";


declare var process:any

export const ActionTypes = {
  LOAD_PROPS: '',
  REQUEST_NEW: '',
  REQUEST_MORE: '',
  RECEIVE_INITIAL: '',
  RESET_STATE: '',
}

export const makeActionTypes = (prefix:string):typeof ActionTypes => {
  return Object.keys(ActionTypes).reduce((o, key) => ({...o, [key]: prefix + '/' + key}), {}) as (typeof ActionTypes)
}


export const makeActions = (actionTypes:typeof ActionTypes, selectors:SelectorsType, modules:ModulesType, apiId:string) => {

  const resetStateAction = () => {
    return {
      type: actionTypes.RESET_STATE,
    }
  }

  const loadPropsAction = (props:IListProps) => {
    return {
      type: actionTypes.LOAD_PROPS,
      props
    }
  }

  const recieveInitialResponseAction = (response:IListResponse) => {
    return {
      type: actionTypes.RECEIVE_INITIAL,
      response
    }
  }

  const makeRequestParams = (state) => {
    return {
      //api
      a: apiId,
      //from
      fr: selectors.getNextIndex(state),
      //limit
      lt: selectors.getLimit(state),
      //regId
      r: selectors.getRegId(state),
    }
  }

  const requestNewAction = () => {
    return (dispatch, getState) => {
      const params = {
        ...makeRequestParams(getState()),
        fr: 0,
      }
      dispatch({
        type: actionTypes.REQUEST_NEW
      })
      dispatch(
        // modules.Api.requestAction(params, IS_LOADING_TOO_LONG_TRESHOLD_MS)
        modules.Api.requestAction(params)
      )
    }
  }

  const requestMoreAction = () => {
    return (dispatch, getState) => {
      dispatch({
        type: actionTypes.REQUEST_MORE
      })
      dispatch(
        // modules.Api.requestAction(makeRequestParams(getState()), IS_LOADING_TOO_LONG_TRESHOLD_MS)
        modules.Api.requestAction(makeRequestParams(getState()))
      )
    }
  }

  return {
    resetStateAction,
    loadPropsAction,
    recieveInitialResponseAction,
    requestNewAction,
    requestMoreAction,
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let a = true ? undefined : makeActions(makeActionTypes(''), null, null, null)
export type ActionsType = typeof a;
