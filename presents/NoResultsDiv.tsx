import * as React from "react";
import {style} from "typestyle";
import * as colors from "../colors";
import {baseDivStyle} from "./divStyles";


const noResultsClass = style(baseDivStyle, {
  color: colors.iosSilver,
  $debugName: 'noReults',
})

interface IProps {
  msg:string
}

/**
 * NoResultsDiv je div zobrazujuci spravu o 0 vysledkoch (nejakeho API nacitavania)
 *
 * Pouziva sa pri nacitavani contentu
 */
export class NoResultsDiv extends React.Component<IProps> {
  render() {
    return (
      <div className={noResultsClass}>
        <i className="fa fa-meh-o"/>
        <div>
          {this.props.msg}
        </div>
      </div>
    )
  }
}
