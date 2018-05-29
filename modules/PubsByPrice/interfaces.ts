import {IPubsResponse} from "../Pubs";

export interface IPubsByPriceProps {
  regId:number
}

export interface IFilter {
  title:string
  filter:string
  initialPubsResponse:IPubsResponse
}
