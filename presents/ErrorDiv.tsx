import * as React from "react";
import {style} from "typestyle";
import * as colors from "../colors";
import {baseDivStyle} from "./divStyles";


const errorLoadingClass = style(baseDivStyle, {
  color: colors.iosRed,
  $debugName: 'errorLoading',
})

interface IProps {
  errorMsg:string
  errorDetailMsg?:string
}

/**
 * ErrorDiv je div zobrazujuci chybovu spravu (nejakeho API nacitavania)
 *
 * Pouziva sa pri error nacitavania v Pubs/PubsByType
 */
export class ErrorDiv extends React.Component<IProps> {
  render() {
    return (
      <div className={errorLoadingClass}>
        <i className="fa fa-frown-o"/>
        <div>
          {this.props.errorMsg}
          {(!!this.props.errorDetailMsg) && (
            <div>
              {'('}{this.props.errorDetailMsg}{')'}
            </div>
          )}
        </div>
      </div>
    )
  }
}
