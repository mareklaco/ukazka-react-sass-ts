import {SelectorsType} from "./reducer";
import {IS_LOADING_TOO_LONG_TRESHOLD_MS, SOURCE_URL} from "./constants";
import {paramsAddHash, request} from "./functions";


export const ActionTypes = {
  ERROR_LOADING: '',
  LOADING_TOO_LONG: '',
  REQUEST: '',
  RECIEVE: '',
}

export const makeActionTypes = (prefix:string):typeof ActionTypes => {
  return Object.keys(ActionTypes).reduce((o, key) => ({...o, [key]: prefix + '/' + key}), {}) as (typeof ActionTypes)
}


export const makeActions = (actionTypes:typeof ActionTypes, selectors:SelectorsType) => {

  //internal actions
  const errorLoadingAction = (message:string) => {
    return {
      type: actionTypes.ERROR_LOADING,
      message
    }
  }

  const loadingTooLongAction = () => {
    return {
      type: actionTypes.LOADING_TOO_LONG,
    }
  }

  const recieveAction = (response) => {
    return {
      type: actionTypes.RECIEVE,
      response
    }
  }

  return {
    requestAction: (params, method:'POST' | 'GET' | 'PUT' | 'DELETE' = 'GET', tooLongTreshold:number = IS_LOADING_TOO_LONG_TRESHOLD_MS) => {
      return (dispatch:Function, getState) => {
        params = paramsAddHash(params)
        dispatch({
          type: actionTypes.REQUEST,
          requestHash: params.h,
        })
        //identifikacia ci isLoadingTooLong
        const isLoadingTooLongCheck = setTimeout(() => {
          if (params.h == selectors.getPendingRequestHash(getState())) {
            dispatch(loadingTooLongAction())
          }
        }, tooLongTreshold)

        request(SOURCE_URL, params, method)
          .then(responseObj => {
            clearTimeout(isLoadingTooLongCheck)
            //akceptovat len posledne pozadovany request
            if (responseObj.hash == selectors.getPendingRequestHash(getState())) {
              dispatch(recieveAction(responseObj))
            }
          })
          .catch(errorMsg => {
            clearTimeout(isLoadingTooLongCheck)
            dispatch(errorLoadingAction(errorMsg))
          })
      }
    }

  }
}
