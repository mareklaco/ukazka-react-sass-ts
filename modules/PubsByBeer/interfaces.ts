import {IPubsResponse} from "../Pubs";

export interface IPubsByBeerProps {
  regId:number
}

export interface IBeerBrand {
  id:number
  name:string
  shortname:string
  pubsCount:number
  /**
   * moze byt null
   */
  minPrice:number
  /**
   * moze byt null
   */
  maxPrice:number
  initialPubsResponse?:IPubsResponse
}
