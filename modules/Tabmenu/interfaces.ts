export interface ITabmenuTab {
  title:string
  xsTitle?:string
}

export interface ITabmenuProps {
  tabs:ITabmenuTab[]
  primaryTabsCount?:number
  disabled?:boolean
}

export interface ITabmenuState {
  currentTab:ITabmenuTab
  tabWasEverChanged:boolean
  isExpanded:boolean
}
