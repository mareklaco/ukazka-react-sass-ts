import * as fromPubs from "../Pubs";
import {ITabmenuTab} from "../Tabmenu";

export interface IRegTabsTab extends ITabmenuTab {
  description?:string
  filter?:string
  component?:string
}

export interface IRegTabsProps {
  //pre Toolbar
  tabs:IRegTabsTab[]
  //pre Pubs
  regId:number
  limit?:number
  initialResponse:fromPubs.IPubsResponse
}
