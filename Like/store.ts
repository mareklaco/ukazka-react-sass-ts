import {makeApiModule} from "../modules/Api";
import {applyMiddleware, combineReducers, createStore, Store} from "redux";
import * as _ from "lodash";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {ILikeButtonProps, ILikeButtonsCore, ILikeButtonState} from "./interfaces";
import {LIKE_REQUEST} from "./actions";
import freeze = require("redux-freeze");


declare var process:any
declare var module:any
declare var require:any


//vytvori sa az ked treba fciou makeLikeButtonsStore() (pri prvom kliku na Like)
let likeButtonsStore:Store<any>
let apiModule


const stateKey = (objType:number, refId:number):string => {
  return 'objType:' + objType + '/refId:' + refId
}

export const likeButtonPropsToState = (likeButtonProps:ILikeButtonProps):ILikeButtonState => {
  return _.omit(likeButtonProps, 'objType', 'refId', 'isLogged') as ILikeButtonState
}

const initialLikeButtonsState:ILikeButtonsCore = {
  pendingRequestObjType: null,
  pendingRequestRefId: null,
  byKey: {}
}

const oneKeyReducer = (state:ILikeButtonState, action) => {

  switch (action.type) {

    case LIKE_REQUEST:
      return {
        ...state,
        isLoadingError: false
      }

    case apiModule.RECIEVE:
      return likeButtonPropsToState(action.response.like)

    case apiModule.LOADING_TOO_LONG:
      return {
        ...state,
        isLoadingTooLong: true
      }

    case apiModule.ERROR_LOADING:
      return {
        ...state,
        isLoadingError: true,
        isLoadingTooLong: false
      }
  }

  return state
}

const reducer = (state:ILikeButtonsCore = initialLikeButtonsState, action) => {

  let key
  switch (action.type) {

    case LIKE_REQUEST:
      key = stateKey(action.objType, action.refId)
      return {
        ...state,
        pendingRequestObjType: action.objType,
        pendingRequestRefId: action.refId,
        byKey: {
          ...state.byKey,
          [key]: oneKeyReducer(state.byKey[key], action),
        }
      }

    case apiModule.RECIEVE:
      key = stateKey(action.response.like.objType, action.response.like.refId)
      return {
        ...state,
        pendingRequestObjType: null,
        pendingRequestRefId: null,
        byKey: {
          ...state.byKey,
          [key]: oneKeyReducer(state.byKey[key], action),
        }
      }

    //akcie zalozene na state.pendingRequestObjType a state.pendingRequestRefId
    case apiModule.LOADING_TOO_LONG:
    case apiModule.ERROR_LOADING:
      if (!state.pendingRequestObjType || !state.pendingRequestRefId) { //pre istotu
        return state
      }
      key = stateKey(state.pendingRequestObjType, state.pendingRequestRefId)
      return {
        ...state,
        pendingRequestObjType: action.type == apiModule.ERROR_LOADING ? null : state.pendingRequestObjType,
        pendingRequestRefId: action.type == apiModule.ERROR_LOADING ? null : state.pendingRequestRefId,
        byKey: {
          ...state.byKey,
          [key]: oneKeyReducer(state.byKey[key], action),
        }
      }

  }

  return state
}

function makeLikeButtonsStore() {

  apiModule = makeApiModule('LikeButtons/Api', (state) => state.api)

  const logger = createLogger({
    diff: true,
    collapsed: true,
  })

  const middleware = (process.env.NODE_ENV === 'production') ?
    [thunk] :
    [thunk, freeze, logger]


  const store:Store<any> = createStore(
    combineReducers({
      core: reducer,
      api: apiModule.reducer
    }),
    applyMiddleware(...middleware)
  )

  return store
}

const getLikeButtonsStore = () => {
  if (!likeButtonsStore) {
    likeButtonsStore = makeLikeButtonsStore()
  }
  return likeButtonsStore
}

export const subscribe = (fn:() => void) => {
  return getLikeButtonsStore().subscribe(fn)
}

export const dispatch = (action) => {
  const actionFnWithApiModule = action(apiModule)
  return getLikeButtonsStore().dispatch(actionFnWithApiModule)
}

export const getLikeButtonState = (objType:number, refId:number):ILikeButtonState => {
  const key = stateKey(objType, refId)
  return getLikeButtonsStore().getState().core.byKey[key]
}
