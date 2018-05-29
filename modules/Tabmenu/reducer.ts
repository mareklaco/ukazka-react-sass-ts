import {ITabmenuState, ITabmenuTab} from "./interfaces";
import {ActionTypes} from "./actions";


const InitialState:ITabmenuState = {
  currentTab: null,
  tabWasEverChanged: false,
  isExpanded: false
}


export const makeSelectors = (moduleState:(s) => ITabmenuState) => {
  return {
    getCurrentTab: (state):ITabmenuTab => moduleState(state).currentTab,
    tabWasEverChanged: (state):boolean => moduleState(state).tabWasEverChanged,
    isExpanded: (state):boolean => moduleState(state).isExpanded,
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let s = true ? undefined : makeSelectors(null)
export type SelectorsType = typeof s


export const makeReducer = (actionTypes:typeof ActionTypes) => {
  return (state:ITabmenuState = InitialState, action):ITabmenuState => {

    switch (action.type) {

      case actionTypes.SET_TAB:
        return {
          ...state,
          currentTab: action.tab,
          tabWasEverChanged: !!state.currentTab,
        }

      case actionTypes.EXPAND:
        return {
          ...state,
          isExpanded: true,
        }

      case actionTypes.COLLAPSE:
        return {
          ...state,
          isExpanded: false,
        }

    }

    return state
  }
}
