export interface IPubsResponse {
  hash:string,
  pubsHtmlChunks:string[],
  hasMorePubs:boolean,
  nextPubIndex:number,
  isFilterConstraining:boolean,
}

export interface IPubsProps {
  filter:string
  filterParams?:any
  regId:number
  limit?:number
  initialResponse?:IPubsResponse
}
