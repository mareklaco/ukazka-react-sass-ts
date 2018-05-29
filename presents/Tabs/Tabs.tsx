import * as React from "react";
import * as cx from "classnames";
import {TabButton} from "./TabButton";


export interface ITabsTab {
  id:string | number
  title:string
  xsTitle?:string
}

export interface ITabsProps {
  tabs:ITabsTab[]
  activeId:string | number
  onClick:(id:string | number) => any
  disabled?:boolean
}

/**
 * Tabs su stackovane buttony
 */
export class Tabs extends React.Component<ITabsProps> {

  render() {
    // console.log('### Tabs.render()', this.props);
    if (!this.props.tabs.length) {
      return null;
    }
    return (
      <div className={cx("Tabs")}>
        {this.props.tabs.map(tab => (
          <TabButton
            key={tab.id}
            id={tab.id}
            title={tab.title}
            xsTitle={tab.xsTitle}
            active={tab.id === this.props.activeId}
            disabled={this.props.disabled}
            onClick={this.props.onClick}
          />
        ))}
      </div>
    )
  }
}
