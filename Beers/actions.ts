import {IBeersAppConfig, ITap} from "./interfaces";
import {PAGE} from "./constants";
import {PAGE_TRANS} from "../Page/constants";


export const ADD_TAP = 'ADD_TAP'
export const RESET_RECENTLY_ADDED_TAP = 'RESET_RECENTLY_ADDED_TAP'
export const DELETE_TAP = 'DELETE_TAP'
export const DELETE_TAPS_REAL = 'DELETE_TAPS_REAL'
export const UNDELETE_TAP = 'UNDELETE_TAP'
export const UPDATE_TAP = 'UPDATE_TAP'
export const SET_TAP_OLD_TYPE_ID = 'SET_TAP_OLD_TYPE_ID'
export const SET_TAP_PRICE = 'SET_TAP_PRICE'
export const SET_EDIT_TAP = 'SET_EDIT_TAP'
export const SUBMIT_EDITING_TAP = 'SUBMIT_EDITING_TAP'
export const CANCEL_TAP_EDITOR = 'CANCEL_TAP_EDITOR'
export const LOAD_CONFIG = 'LOAD_CONFIG'
export const LOAD_TAPS = 'LOAD_TAPS'
export const LOAD_DEV_TAPS = 'LOAD_DEV_TAPS'
export const CHANGE_SEARCH_BRAND_QUERY = 'CHANGE_SEARCH_BRAND_QUERY'
export const GOTO_PAGE = 'GOTO_PAGE'
export const GOTO_PAGE_REDUX = 'GOTO_PAGE/REDUX'
export const GOTO_PAGE_HISTORY = 'GOTO_PAGE/HISTORY'


export const addTapAction = (brandId:number, addToEnd:boolean = false) => {
  return {
    type: ADD_TAP,
    brandId,
    addToEnd,
  }
}

export const deleteTapAction = (tap:ITap) => {
  return {
    type: DELETE_TAP,
    tap
  }
}

export const deleteTapsRealAction = () => {
  return {
    type: DELETE_TAPS_REAL,
  }
}

export const unDeleteTapAction = (tap:ITap) => {
  return {
    type: UNDELETE_TAP,
    tap
  }
}

export const updateTapAction = (tap:ITap) => {
  return {
    type: UPDATE_TAP,
    tap
  }
}

export const setTapOldTypeIdAction = (oldTypeId:number) => {
  return {
    type: SET_TAP_OLD_TYPE_ID,
    oldTypeId
  }
}

export const setTapPriceAction = (price:number) => {
  return {
    type: SET_TAP_PRICE,
    price
  }
}

export const cancelTapEditorAction = () => {
  return {
    type: CANCEL_TAP_EDITOR,
  }
}

export const loadConfigAction = (config:IBeersAppConfig) => {
  return {
    type: LOAD_CONFIG,
    config
  }
}

export const loadTapsAction = (taps:ITap[]) => {
  return {
    type: LOAD_TAPS,
    taps
  }
}

export const loadDevTapsAction = () => {
  return {
    type: LOAD_DEV_TAPS,
  }
}

export const changeSearchBrandQueryAction = (searchBrandQuery:string) => {
  return {
    type: CHANGE_SEARCH_BRAND_QUERY,
    searchBrandQuery
  }
}

/**
 * Spravi zmenu stranky v redux stave a zaroven pushne stranku do browser history
 *
 * vid state.pageHistory a makeRouterMiddleware()
 */
export const gotoPageAction = (...args) => {
  return (dispatch) => {
    dispatch(gotoPageReduxAction(...args))
    dispatch({
      type: GOTO_PAGE_HISTORY,
      page: args[0]
    })
  }
}

export const gotoPageReduxAction = (page?:PAGE, transition:PAGE_TRANS = PAGE_TRANS.Forward, leaveCause?) => {
  return {
    type: GOTO_PAGE_REDUX,
    page,
    transition,
    leaveCause,
  }
}

export const setEditTapAction = (tap:ITap | null) => {
  return {
    type: SET_EDIT_TAP,
    tap,
  }
}

export const gotoEditTapPageAction = (tap:ITap, transition?:PAGE_TRANS, leaveCause?) => {
  return (dispatch) => {
    if (tap) {
      dispatch(setEditTapAction(tap))
    }
    dispatch(gotoPageAction(PAGE.EditTapPage, transition, leaveCause))
  }
}

export const gotoTypeEditPageAction = (leaveCause?) => {
  return gotoPageAction(PAGE.TypeEditTapPage, PAGE_TRANS.Forward, leaveCause)
}

export const gotoPriceEditPageAction = (leaveCause?) => {
  return gotoPageAction(PAGE.PriceEditTapPage, PAGE_TRANS.Forward, leaveCause)
}
