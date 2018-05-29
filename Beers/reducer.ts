import * as _ from "lodash";
import {v4 as uuid} from "uuid";
import {
  ADD_TAP, CANCEL_TAP_EDITOR, CHANGE_SEARCH_BRAND_QUERY, DELETE_TAP, DELETE_TAPS_REAL, GOTO_PAGE, GOTO_PAGE_REDUX,
  LOAD_CONFIG, LOAD_DEV_TAPS, LOAD_TAPS, RESET_RECENTLY_ADDED_TAP, SET_EDIT_TAP, SET_TAP_OLD_TYPE_ID, SET_TAP_PRICE,
  SUBMIT_EDITING_TAP, UNDELETE_TAP, UPDATE_TAP
} from "./actions";
import {IBrand, IRichTap, IState, ITap} from "./interfaces";
import {searchBrandsResultsSelector} from "./selectors";
import {MIN_SEARCH_QUERY_CHARS, PAGE} from "./constants";
import {PAGE_TRANS} from "../Page/constants";
import {pageHistoryGotoPage} from "../Page/reducer";


export const makeTap = ():ITap => {
  return {
    key: uuid(),
    oldTypeId: 620, //12st
    brandId: null,
    styleId: null,
    litres: 0.5,
    price: null,
  }
}

const devTaps = [
  {
    key: uuid(),
    brandId: 1,
    oldTypeId: 620,
    litres: 0.5,
    price: 1.25,
    styleId: 1,
    degrees: 12,
  },
  {
    key: uuid(),
    brandId: 2,
    oldTypeId: 620,
    litres: 0.4,
    price: 1.05,
    styleId: 1,
    degrees: 10,
  },
  {
    key: uuid(),
    brandId: 1,
    oldTypeId: 620,
    litres: 0.5,
    price: 1.25,
    styleId: 1,
    degrees: 12,
  },
  {
    key: uuid(),
    brandId: 2,
    oldTypeId: 620,
    litres: 0.4,
    price: 1.05,
    styleId: 1,
    degrees: 10,
  },
  {
    key: uuid(),
    brandId: 1,
    oldTypeId: 620,
    litres: 0.5,
    price: 1.25,
    styleId: 1,
    degrees: 12,
  },
  {
    key: uuid(),
    brandId: 2,
    oldTypeId: 620,
    litres: 0.4,
    price: 1.99,
    styleId: 1,
    degrees: 10,
  },
]

const InitialState:IState = {

  /**
   * Items su jednotlive vycapy - pipy. T.j. znacka+druh. Maju svoje ceny+objem
   */
  taps: [],

  editingTapKey: null,
  recentlyAddedTapKey: null,
  searchBrandQuery: null,

  brandsById: {},
  oldTypesById: {},
  oldTypesIds: [],
  stylesById: {},

  pageHistory: {
    pageCounter: 1,
    zIndex: 1,
    location: {
      pathname: PAGE.TapsPage,
      search: undefined,
      state: undefined,
      hash: undefined,
    },
    curPageTrans: PAGE_TRANS.None,
    leaveCaseByZIndex: {},
  },
}

// export const isTapEditorOpen = (state:IState):boolean => {
//   return !!state.editingTapKey
// }

export const hasSearchBrandQuery = (state:IState):boolean => {
  return !!state.searchBrandQuery && state.searchBrandQuery.length >= MIN_SEARCH_QUERY_CHARS
}

/**
 * True ak su vysledky vyhladavania
 */
export const hasSearchBrandResults = (state:IState):boolean => {
  return searchBrandsResultsSelector(state).length > 0
}

/**
 * Vrati prvy brand z vysledkov vyhladavania
 */
export const firstSearchBrandResult = (state:IState):IBrand => {
  return searchBrandsResultsSelector(state)[0]
}

/**
 * True ak nie su vysledky vyhladavania (a hladalo sa)
 */
export const noSearchBrandResults = (state:IState):boolean => {
  return hasSearchBrandQuery(state) && !hasSearchBrandResults(state)
}

const deleteTap = (tap:ITap, action):ITap => {
  return {...tap, isDeleted: true}
}

const unDeleteTap = (tap:ITap, action):ITap => {
  return {...tap, isDeleted: false}
}

const updateEditingTap = (state:IState, prop:string, value):IState => {
  if (!state.editingTapKey) {
    return state
  }
  return {
    ...state,
    taps: state.taps.map(t => ((t.key == state.editingTapKey)
        ? {
          ...t,
          [prop]: value
        }
        : t
    ))
  }
}

const handleOneOfTaps = (taps:ITap[], action, handleTapFn):ITap[] => {
  return taps.map(t => t.key == action.tap.key ? handleTapFn(t, action) : t)
}

export const getTapByKey = (state:IState, key:string):ITap => {
  return key && state.taps.filter(t => t.key == key)[0]
}

export const getEditedTap = (state:IState):ITap => {
  return getTapByKey(state, state.editingTapKey)
}

export const getRecentlyAddedTap = (state:IState):ITap => {
  return getTapByKey(state, state.recentlyAddedTapKey)
}

export const getRichTap = (key:string, state:IState):IRichTap => {
  const tap = getTapByKey(state, key)
  if (!tap) {
    return null
  }
  return {
    ...tap,
    brand: state.brandsById[tap.brandId],
    oldType: state.oldTypesById[tap.oldTypeId],
  }
}

export const stripRichTap = (richTap:IRichTap):ITap => {
  return _.omit(richTap, ['brand', 'oldType']) as ITap
}


export const reducer = (state:IState = InitialState, action):IState => {

  switch (action.type) {

    case GOTO_PAGE:
    case GOTO_PAGE_REDUX:
      return {
        ...state,
        pageHistory: pageHistoryGotoPage(state.pageHistory, action.page, action.transition, action.leaveCause)
      }

    case SET_EDIT_TAP:
      return {
        ...state,
        editingTapKey: action.tap ? action.tap.key : null,
      }

    case ADD_TAP:
      const newTap = makeTap()
      newTap.brandId = action.brandId
      return {
        ...state,
        pageHistory: pageHistoryGotoPage(state.pageHistory, PAGE.EditTapPage),
        taps: action.addToEnd ? state.taps.concat(newTap) : [newTap].concat(state.taps),
        editingTapKey: newTap.key,
        recentlyAddedTapKey: newTap.key,
        searchBrandQuery: null,
      }

    case RESET_RECENTLY_ADDED_TAP:
      return {
        ...state,
        recentlyAddedTapKey: null,
      }

    case UPDATE_TAP:
      return {
        ...state,
        taps: state.taps.map(t => t.key === action.tap.key ? action.tap : t),
      }

    case SET_TAP_OLD_TYPE_ID:
      return updateEditingTap(state, 'oldTypeId', action.oldTypeId)

    case SET_TAP_PRICE:
      return updateEditingTap(state, 'price', action.price)

    case DELETE_TAP:
      return {
        ...state,
        taps: handleOneOfTaps(state.taps, action, deleteTap),
      }

    case DELETE_TAPS_REAL:
      return {
        ...state,
        taps: state.taps.filter(t => !t.isDeleted),
      }

    case UNDELETE_TAP:
      return {
        ...state,
        taps: handleOneOfTaps(state.taps, action, unDeleteTap),
      }

    case SUBMIT_EDITING_TAP:
      return {
        ...state,
        editingTapKey: null,
      }

    case CANCEL_TAP_EDITOR:
      return {
        ...state,
        editingTapKey: null,
      }

    case LOAD_CONFIG:
      return {
        ...state,
        brandsById: _.keyBy(action.config.brands, 'id'),
        oldTypesById: _.mapValues(_.keyBy(action.config.oldTypes, 'id'), 'name'),
        oldTypesIds: action.config.oldTypes.map(ot => ot.id),
        stylesById: action.config.styles,
      }

    case LOAD_TAPS:
      return {
        ...state,
        taps: action.taps.map(t => ({
          ...t, key: uuid()
        })),
      }

    case LOAD_DEV_TAPS:
      return {
        ...state,
        taps: devTaps,
      }

    case CHANGE_SEARCH_BRAND_QUERY:
      return {
        ...state,
        searchBrandQuery: action.searchBrandQuery,
      }

  }

  return state
}

