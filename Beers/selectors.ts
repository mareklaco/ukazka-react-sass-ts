import {createSelector} from "reselect";
import * as diacritics from "diacritics";
import * as Fuse from "fuse.js"
import {IBrand, IBrandForSearch, IBrandsById, IState} from "./interfaces";
import {brandsByNameSorter, isMostUsedBrandFilter, isSpecialBrandFilter} from "./functions";
import {MAX_SEARCH_RESULTS_BRANDS_COUNT, MIN_SEARCH_QUERY_CHARS} from "./constants";


const brandsArraySelector = createSelector(
  (state:IState) => state.brandsById,
  (brandsById:IBrandsById):IBrand[] => {
    return Object.keys(brandsById).map(id => brandsById[id])
  }
)

export const brandsForSearchSelector = createSelector(
  brandsArraySelector,
  (brands:IBrand[]):IBrandForSearch[] => {
    return brands.map(b => ({
      ...b,
      searchBase: diacritics.remove(b.name).toLowerCase()
    }))
  }
)

export const brandsByNameSelector = createSelector(
  brandsArraySelector,
  (brands:IBrand[]):IBrand[] => {
    return [...brands]
      .sort(brandsByNameSorter)
  }
)

export const mostUsedBrandsSelector = createSelector(
  brandsArraySelector,
  (brands:IBrand[]):IBrand[] => {
    return [...brands]
      .filter(isMostUsedBrandFilter)
      .sort(brandsByNameSorter)
  }
)

export const specialBrandsSelector = createSelector(
  brandsArraySelector,
  (brands:IBrand[]):IBrand[] => {
    return brands
      .filter(isSpecialBrandFilter)
      .sort(brandsByNameSorter)
  }
)

export const searchBrandsResultsSelector = createSelector(
  brandsForSearchSelector,
  (state:IState) => state.searchBrandQuery,
  (brandsForSearch:IBrandForSearch[], query:string):IBrand[] => {
    if (!query || query.length < MIN_SEARCH_QUERY_CHARS) {
      return []
    }

    //@link http://fusejs.io/
    const fuse = new Fuse(brandsForSearch, {
      keys: ['searchBase'],
      // tokenize: true,
      threshold: 0.3,
    })

    const querySearchBase = diacritics.remove(query).toLowerCase()
    return fuse
      .search<IBrand>(querySearchBase)
      .slice(0, MAX_SEARCH_RESULTS_BRANDS_COUNT)
  }
)
