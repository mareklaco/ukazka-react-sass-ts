import {IPageHistory} from "./interfaces";
import {PAGE_TRANS} from "./constants";


export const pageHistoryGetLeaveCause = (pageHistory:IPageHistory):any => {
  return pageHistory.leaveCaseByZIndex[pageHistory.zIndex]
}

export const pageHistoryGotoPage = (pageHistory:IPageHistory, page:string, pageTrans:PAGE_TRANS = PAGE_TRANS.Forward, leaveCause?):IPageHistory => {
  return {
    pageCounter: pageHistory.pageCounter + 1,
    zIndex: Math.max(0, pageHistory.zIndex + (pageTrans == PAGE_TRANS.Back ? -1 : +1)),
    location: {
      pathname: page,
      search: undefined,
      state: undefined,
      hash: undefined,
    },
    curPageTrans: pageTrans,
    leaveCaseByZIndex: {
      ...pageHistory.leaveCaseByZIndex,
      [pageHistory.zIndex]: leaveCause
    }
  }
}
