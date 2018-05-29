export interface IListResponse {
  hash:string,
  items:any,
  hasMore:boolean,
  nextIndex:number,
}

interface IItemComponentProps {
  item:any
}

export interface IListProps {
  itemComponent:React.ComponentClass<IItemComponentProps>
  regId:number
  limit?:number
  initialResponse?:IListResponse
}
