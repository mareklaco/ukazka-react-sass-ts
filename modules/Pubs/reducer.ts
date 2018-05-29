import {FEW_PUBS_TRESHOLD} from "./constants";
import {combineReducers} from "redux";
import {IApiState} from "../Api";
import {ActionTypes} from "./actions";
import {ModulesType} from "./modules";


interface ICoreState {

  //props
  filter:string
  filterParams:any
  regId:number
  limit?:number

  isLoadingNewPubs:boolean
  isLoadingMorePubs:boolean
  pubsHtmlChunks:string[]
  hasMorePubs:boolean
  prevPubIndex:number
  nextPubIndex:number
  isInitialResponse:boolean
  isFilterConstraining:boolean
}

const InitialState:ICoreState = {

  //props
  filter: null,
  filterParams: undefined,
  regId: null,
  limit: undefined,

  isLoadingNewPubs: false,
  isLoadingMorePubs: false,
  pubsHtmlChunks: [],
  hasMorePubs: false,
  prevPubIndex: 0,
  nextPubIndex: 0,
  isInitialResponse: false,
  isFilterConstraining: false,
}

export const makeReducer = (actionTypes:typeof ActionTypes, modules:ModulesType) => {
  const reducer = (state:ICoreState = InitialState, action):ICoreState => {

    switch (action.type) {

      case actionTypes.RESET_STATE:
        return InitialState

      case actionTypes.LOAD_PROPS:
        return {
          ...state,
          filter: action.props.filter,
          filterParams: action.props.filterParams,
          regId: action.props.regId,
          limit: action.props.limit, //volitelny
        }


      case modules.Api.ERROR_LOADING:
        return {
          ...state,
          //filter tu nesmieme nulovat, lebo by vznikol nekonecny cyklus
          isLoadingNewPubs: false,
          isLoadingMorePubs: false,
          pubsHtmlChunks: [],
          hasMorePubs: false,
        }

      case actionTypes.REQUEST_NEW:
        return {
          ...state,
          isLoadingNewPubs: true,
          isLoadingMorePubs: false,
        }

      case actionTypes.REQUEST_MORE:
        return {
          ...state,
          isLoadingNewPubs: false,
          isLoadingMorePubs: true,
        }

      case actionTypes.RECEIVE_INITIAL:
      case modules.Api.RECIEVE:
        const isReceivingNewPubs = state.isLoadingNewPubs
        return {
          ...state,
          isLoadingNewPubs: false,
          isLoadingMorePubs: false,
          pubsHtmlChunks: isReceivingNewPubs
            ? action.response.pubsHtmlChunks
            : state.pubsHtmlChunks.concat(action.response.pubsHtmlChunks),
          hasMorePubs: action.response.hasMorePubs,
          prevPubIndex: isReceivingNewPubs ? 0 : state.nextPubIndex,
          nextPubIndex: action.response.nextPubIndex,
          isInitialResponse: action.type == actionTypes.RECEIVE_INITIAL,
          isFilterConstraining: action.response.isFilterConstraining,
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

export interface IPubsState {
  Core:ICoreState
  Api:IApiState
}

export const makeSelectors = (moduleState:Function, modules:ModulesType) => {
  const coreState = (state):ICoreState => moduleState(state).Core

  const isLoadingNewPubs = (state):boolean => coreState(state).isLoadingNewPubs
  const isLoadingMorePubs = (state):boolean => coreState(state).isLoadingMorePubs
  const isLoadingTooLong = (state):boolean => modules.Api.isLoadingTooLong(state)
  const getPubsHtmlChunks = (state):string[] => coreState(state).pubsHtmlChunks
  const hasMorePubs = (state):boolean => coreState(state).hasMorePubs
  const getPrevPubIndex = (state):number => coreState(state).prevPubIndex
  const getNextPubIndex = (state):number => coreState(state).nextPubIndex
  const getFilter = (state):string => coreState(state).filter
  const getFilterParams = (state):string => coreState(state).filterParams
  const getLimit = (state):number => coreState(state).limit
  const getRegId = (state):number => coreState(state).regId
  const isInitialResponse = (state):boolean => coreState(state).isInitialResponse

  //pocet je maly AK aktualny filter je neobmedzujuci (len zoradujuci) a zobrazujeme od prveho
  //a pocet podnikov je mensi/rovny ako FEW_PUBS_TRESHOLD a zaroven nemame viac podnikov a nenacitavame prave
  //a nie je chyba nacitavania
  const isFewPubs = (state):boolean => {
    return !coreState(state).isFilterConstraining
      && (0 == getPrevPubIndex(state))
      && (FEW_PUBS_TRESHOLD >= getPubsHtmlChunks(state).length)
      && !hasMorePubs(state)
      && !isLoadingNewPubs(state)
      && !modules.Api.isErrorLoading(state)
  }

  return {
    isLoadingNewPubs,
    isLoadingMorePubs,
    isLoadingTooLong,
    getPubsHtmlChunks,
    hasMorePubs,
    getPrevPubIndex,
    getNextPubIndex,
    getFilter,
    getFilterParams,
    getLimit,
    getRegId,
    isInitialResponse,
    isFewPubs
  }

}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let s = true ? undefined : makeSelectors(null, null)
export type SelectorsType = typeof s
