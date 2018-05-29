import * as React from "react";
import * as cx from "classnames";


interface ITabButtonProps {
  id:string | number
  title:string
  xsTitle?:string
  active:boolean
  onClick:(key:string | number) => any
  disabled?:boolean
}

/**
 * Button pre Tabs
 */
export class TabButton extends React.Component<ITabButtonProps> {

  onClick = () => {
    this.props.onClick(this.props.id)
  }

  render() {
    // console.log('### TabButton.render()', this.props);
    return (
      <button
        type="button"
        className={cx("TabButton", {
            TabButton__active: this.props.active,
          }
        )}
        onClick={!this.props.active && !this.props.disabled && this.onClick}
        disabled={this.props.disabled}
      >
        {(this.props.xsTitle) && (
          <span className="hiddenXs">
          {this.props.title}
          </span>
        )}
        {(this.props.xsTitle) && (
          <span className="visibleXs">
          {this.props.xsTitle}
          </span>
        )}
        {(!this.props.xsTitle) && (
          <span>
          {this.props.title}
          </span>
        )}
      </button>
    )
  }
}
