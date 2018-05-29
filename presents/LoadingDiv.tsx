import * as React from "react";
import {style} from "typestyle";
import * as colors from "../colors";
import {baseDivStyle} from "./divStyles";


const isLoadingClass = style(baseDivStyle, {
  //aby sa nestacil spinner naplno ukazat, kym sa rychlo nacitaju data
  animation: 'fadeIn 3s',
  color: colors.iosSilver,
  cursor: 'wait',
  $debugName: 'isLoading',
})


/**
 * LoadingDiv je div zobrazujuci tociaci sa spinner s animaciou fadeIn
 *
 * Pouziva sa pocas nacitavania contentu
 */
export class LoadingDiv extends React.Component {
  render() {
    return (
      <div className={isLoadingClass}>
        <i className="fa fa-spinner fa-spin"/>
      </div>
    )
  }
}
