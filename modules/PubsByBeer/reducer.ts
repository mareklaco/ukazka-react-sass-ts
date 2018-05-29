import {combineReducers} from "redux";
import {IBeerBrand} from "./interfaces";
import {IApiState} from "../Api";
import {ModulesType} from "./modules";
import {ActionTypes} from "./actions";


interface ICoreState {
  regId:number
}

const InitialState:ICoreState = {
  regId: null,
}

export const makeReducer = (actionTypes:typeof ActionTypes, modules:ModulesType) => {

  const coreReducer = (state:ICoreState = InitialState, action):ICoreState => {

    switch (action.type) {

      case actionTypes.SET_REG_ID:
        return {
          ...state,
          regId: action.regId
        }

    }

    return state
  }

  interface ICombinedState {
    Core:ICoreState
    Api:IApiState
  }

  const combinedReducer = combineReducers({
    Core: coreReducer,
    Api: modules.Api.reducer,
  })

  /**
   * Ucelom rootReducer je pocuvat na akciu RESET_STATE a tak resetnut VSETKY reducery
   *
   * @link https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
   */
  const rootReducer = (state, action) => {
    if (actionTypes.RESET_STATE == action.type) {
      state = undefined
    }
    return combinedReducer(state, action)
  }

  return rootReducer
}

export const makeSelectors = (moduleState:Function, modules:ModulesType) => {

  //Core
  const getCoreState = (state):ICoreState => moduleState(state).Core
  const getRegId = (state):number => getCoreState(state).regId

  //Api
  const getBeerBrands = (state):IBeerBrand[] => {
    const response = modules.Api.getResponse(state)
    return response && response.beerBrands || []
  }

  return {
    getRegId,
    getBeerBrands,
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let s = true ? undefined : makeSelectors(null, null)
export type SelectorsType = typeof s
