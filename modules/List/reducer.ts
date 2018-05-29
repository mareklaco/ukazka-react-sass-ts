import {combineReducers} from "redux";
import {IApiState} from "../Api";
import {ActionTypes} from "./actions";
import {ModulesType} from "./modules";


interface ICoreState {

  //props
  regId:number
  limit?:number

  isLoadingNew:boolean
  isLoadingMore:boolean
  items:any[]
  hasMore:boolean
  prevIndex:number
  nextIndex:number
  isInitialResponse:boolean
}

const InitialState:ICoreState = {

  //props
  regId: null,
  limit: undefined,

  isLoadingNew: false,
  isLoadingMore: false,
  items: [],
  hasMore: false,
  prevIndex: 0,
  nextIndex: 0,
  isInitialResponse: false,
}

export const makeReducer = (actionTypes:typeof ActionTypes, modules:ModulesType) => {
  const reducer = (state:ICoreState = InitialState, action):ICoreState => {

    switch (action.type) {

      case actionTypes.RESET_STATE:
        return InitialState

      case actionTypes.LOAD_PROPS:
        return {
          ...state,
          regId: action.props.regId,
          limit: action.props.limit, //volitelny
        }


      case modules.Api.ERROR_LOADING:
        return {
          ...state,
          //filter tu nesmieme nulovat, lebo by vznikol nekonecny cyklus
          isLoadingNew: false,
          isLoadingMore: false,
          items: [],
          hasMore: false,
        }

      case actionTypes.REQUEST_NEW:
        return {
          ...state,
          isLoadingNew: true,
          isLoadingMore: false,
        }

      case actionTypes.REQUEST_MORE:
        return {
          ...state,
          isLoadingNew: false,
          isLoadingMore: true,
        }

      case actionTypes.RECEIVE_INITIAL:
      case modules.Api.RECIEVE:
        const isReceivingNew = state.isLoadingNew
        return {
          ...state,
          isLoadingNew: false,
          isLoadingMore: false,
          items: isReceivingNew
            ? action.response.items
            : state.items.concat(action.response.items),
          hasMore: action.response.hasMore,
          prevIndex: isReceivingNew ? 0 : state.nextIndex,
          nextIndex: action.response.nextIndex,
          isInitialResponse: action.type == actionTypes.RECEIVE_INITIAL,
        }
    }

    return state
  }

  const combinedReducer = combineReducers({
    Core: reducer,
    Api: modules.Api.reducer,
  })

  return combinedReducer
}

export interface IListState {
  Core:ICoreState
  Api:IApiState
}

export const makeSelectors = (moduleState:Function, modules:ModulesType) => {
  const coreState = (state):ICoreState => moduleState(state).Core

  const isLoadingNew = (state):boolean => coreState(state).isLoadingNew
  const isLoadingMore = (state):boolean => coreState(state).isLoadingMore
  const isLoadingTooLong = (state):boolean => modules.Api.isLoadingTooLong(state)
  const getItems = (state) => coreState(state).items
  const hasMore = (state):boolean => coreState(state).hasMore
  const getPrevIndex = (state):number => coreState(state).prevIndex
  const getNextIndex = (state):number => coreState(state).nextIndex
  const getLimit = (state):number => coreState(state).limit
  const getRegId = (state):number => coreState(state).regId
  const isInitialResponse = (state):boolean => coreState(state).isInitialResponse

  return {
    isLoadingNew,
    isLoadingMore,
    isLoadingTooLong,
    getItems,
    hasMore,
    getPrevIndex,
    getNextIndex,
    getLimit,
    getRegId,
    isInitialResponse,
  }

}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let s = true ? undefined : makeSelectors(null, null)
export type SelectorsType = typeof s
