import {IPubsProps, IPubsResponse} from "./interfaces";
import {IS_LOADING_TOO_LONG_TRESHOLD_MS} from "./constants";
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


export const makeActions = (actionTypes:typeof ActionTypes, selectors:SelectorsType, modules:ModulesType) => {

  const resetStateAction = () => {
    return {
      type: actionTypes.RESET_STATE,
    }
  }

  const loadPropsAction = (props:IPubsProps) => {
    return {
      type: actionTypes.LOAD_PROPS,
      props
    }
  }

  const recieveInitialResponseAction = (response:IPubsResponse) => {
    return {
      type: actionTypes.RECEIVE_INITIAL,
      response
    }
  }

  const makeRequestParams = (state) => {
    const filterParams = selectors.getFilterParams(state) || {}
    return {
      //api
      a: 'Pubs',
      //from
      fr: selectors.getNextPubIndex(state),
      //filter
      ft: selectors.getFilter(state),
      //limit
      lt: selectors.getLimit(state),
      //regId
      r: selectors.getRegId(state),
      ...filterParams
      //requestId zatial sa nepouziva, nech URLky su rovnake kvoli cachovaniu rovnakych requestov
      //id: hash('' + Math.random(), 4),
    }
  }

  const requestNewPubsAction = () => {
    return (dispatch, getState) => {
      const params = {
        ...makeRequestParams(getState()),
        fr: 0,
      }
      dispatch({
        type: actionTypes.REQUEST_NEW
      })
      dispatch(
        modules.Api.requestAction(params, 'GET', IS_LOADING_TOO_LONG_TRESHOLD_MS)
      )

      //todo: implemntovat spomalenie tak ako bolo predtym?
      /*
      const started = Date.now()
      //timeout: spustit az po LOAD_PUBS_MIN_DELAY_MS ms od start
      setTimeout(
        () => {
          //akceptovat len posledne pozadovany request
          if (responseObj.hash == getPendingRequestHash(getState())) {
            dispatch(recieveNewPubsAction(responseObj))
          }
        },
        Math.max(0, started - Date.now() + LOAD_PUBS_MIN_DELAY_MS)
      )
      */
    }

  }

  const requestMorePubsAction = () => {
    return (dispatch, getState) => {
      dispatch({
        type: actionTypes.REQUEST_MORE
      })
      dispatch(
        modules.Api.requestAction(makeRequestParams(getState()), 'GET', IS_LOADING_TOO_LONG_TRESHOLD_MS)
      )
    }
  }

  return {
    resetStateAction,
    loadPropsAction,
    recieveInitialResponseAction,
    requestNewPubsAction,
    requestMorePubsAction
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let a = true ? undefined : makeActions(makeActionTypes(''), null, null)
export type ActionsType = typeof a;
