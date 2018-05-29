import {PAGE_TRANS} from "./constants";
import {Location} from "history";

export interface IPageHistory {
  //pre unikatny key pre Transition
  pageCounter:number
  zIndex:number
  location:Location
  curPageTrans:PAGE_TRANS
  leaveCaseByZIndex:{
    [zIndex:number]:any
  }
}

/**
 */
export interface IStateWithPageHistory {
  pageHistory:IPageHistory
}
