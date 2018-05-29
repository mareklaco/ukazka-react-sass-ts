import * as React from "react";
import * as cx from "classnames";


interface IProps {
  className?:string
}

/**
 * Vertikalna medzera
 *
 * Na pouzitie medzi UI prvkami.
 */
export class Spacer extends React.Component<IProps> {

  render() {
    return (
      <div className={cx("Spacer", this.props.className)}/>
    )
  }

}
