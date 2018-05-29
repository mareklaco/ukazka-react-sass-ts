import {IAvatarUser} from "../../User";
import {ILikeButtonProps} from "../../Like";

interface IReg {
  name:string
  link:string
}

interface IRelatedPub {
  name:string
  link:string
}

export interface IFeedItem {
  id:number
  // refId:number
  regs?:IReg[]
  dateTime:string
  user?:IAvatarUser
  nonRegUserName?:string
  eventMsg:string
  relatedPub?:IRelatedPub
  /**
   * Ci akcia je povazovana "v" podniku
   *
   * Napr. "pije pivo", na rozdiel od "zaklada" ci "komentuje".
   */
  inRelatedPub?:boolean
  html?:string
  /**
   * Nepovinne, ak nedodane, neda sa likovat, nezobrazuje sa
   */
  like?:ILikeButtonProps
}

export interface IFeedResponse {
  hash:string
  items:IFeedItem[]
  hasMore:boolean
  nextIndex:number
}

export interface IFeedProps {
  regId:number
  limit?:number
  initialResponse?:IFeedResponse
}
