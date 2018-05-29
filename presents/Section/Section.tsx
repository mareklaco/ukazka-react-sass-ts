import * as React from "react";
import * as cx from "classnames";


interface IProps {
  className?:string
  title?:string
  children?:any
}

/**
 * UI sekcia s titulkom
 */
export class Section extends React.Component<IProps> {

  render() {
    return (
      <div className={cx("Section", this.props.className)}>
        {(!!this.props.title) && (
          <div className="title">
            {this.props.title}
          </div>
        )}
        <div className="body">
          {this.props.children}
        </div>
      </div>
    )
  }

}
