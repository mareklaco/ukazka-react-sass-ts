import {IApiState} from "./interfaces";
import {ActionTypes} from "./actions";


export const InitialApiState:IApiState = {
  pendingRequestHash: null,
  errorLoadingMsg: null,
  isLoading: false,
  isLoadingTooLong: false,
  response: null,
}


export const makeSelectors = (moduleState:Function) => {
  return {
    isLoading: (state):boolean => moduleState(state).isLoading,
    isLoadingTooLong: (state):boolean => moduleState(state).isLoadingTooLong,
    isErrorLoading: (state):boolean => !!moduleState(state).errorLoadingMsg,
    getErrorLoadingMsg: (state):string => moduleState(state).errorLoadingMsg,
    getPendingRequestHash: (state):string => moduleState(state).pendingRequestHash,
    getResponse: (state):any => moduleState(state).response,
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let s = true ? undefined : makeSelectors(null)
export type SelectorsType = typeof s


export const makeReducer = (actionTypes:typeof ActionTypes) => {
  return (state:IApiState = InitialApiState, action):IApiState => {

    switch (action.type) {

      case actionTypes.LOADING_TOO_LONG:
        return {
          ...state,
          isLoadingTooLong: true,
        }

      case actionTypes.ERROR_LOADING:
        return {
          ...state,
          errorLoadingMsg: action.message,
          isLoading: false,
          isLoadingTooLong: false,
        }

      case actionTypes.REQUEST:
        return {
          ...state,
          pendingRequestHash: action.requestHash,
          isLoading: true,
          isLoadingTooLong: false,
          errorLoadingMsg: null,
        }

      case actionTypes.RECIEVE:
        return {
          ...state,
          pendingRequestHash: null,
          isLoading: false,
          isLoadingTooLong: false,
          errorLoadingMsg: null,
          response: action.response,
        }

    }

    return state
  }
}
