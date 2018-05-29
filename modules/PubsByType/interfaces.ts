import {IPubsResponse} from "../Pubs";

export interface IPubsByTypeProps {
  regId:number
}

export interface IFilter {
  title:string
  filter:string
  count?:number
  initialPubsResponse?:IPubsResponse
}
