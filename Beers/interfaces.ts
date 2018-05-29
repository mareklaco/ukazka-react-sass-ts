/**
 * pride zvonku takto (ako pole) a takto je ulozeny v stave (byIds)
 */
import {IPageHistory} from "../Page/interfaces";

export interface IBrand {
  id:number
  name:string
  shortname:string
  isActive:number //1|0
  grp:"" | "SK" | "CZ" | "DE" //...
  usageCount:number
}

export interface IBrandForSearch extends IBrand {
  /**
   * nazov bez diakritiky a prevedeny na male pismena
   */
  searchBase:string
}

interface IIdNumbersToStrings {
  [id:number]:string
}

export interface IStylesById extends IIdNumbersToStrings {
}

export interface IOldTypesById extends IIdNumbersToStrings {
}

export interface IBeersAppConfig {
  brands:IBrand[]
  oldTypes:IOldTypesById
  styles:IStylesById
}

export interface IBrandsById {
  [id:number]:IBrand
}

export interface ITap {
  key:string
  brandId:number
  oldTypeId:number
  price?:number
  litres?:number
  styleId?:number
  /**
   * mnozstvo alkoholu v stupnoch plato
   */
  degrees?:number
  isDeleted?:boolean
}

export interface IRichTap extends ITap {
  brand:IBrand
  oldType:string
}

/**
 */
export interface IState {
  taps:ITap[]
  /**
   * pre desktop; v ktorom Tap-e sa zobrazi BeerEditor, mobil: ktory tap sa edituje
   */
  editingTapKey?:string
  recentlyAddedTapKey?:string
  brandsById:IBrandsById
  /**
   * id => nazov
   */
  oldTypesById:IOldTypesById
  /**
   * Usporiadane pole IDciek
   */
  oldTypesIds:number[]
  stylesById:IStylesById
  searchBrandQuery?:string
  pageHistory:IPageHistory
}
