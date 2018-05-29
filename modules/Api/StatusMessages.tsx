import * as React from "react";
import {connect} from "react-redux";
import {ErrorDiv, LoadingDiv, NoResultsDiv} from "../../presents";
import {SelectorsType} from "./reducer";


export const makeStatusMessages = (selectors:SelectorsType):React.ComponentClass<any> => {

  interface IProps {
    /**
     * Ak zadane, tak musi byt true aby za zobrazil <LoadingDiv/>
     */
    isLoadingCondition?:boolean
    /**
     * Ci nemame ziadne vysledky (to zistime z OBSAHU response)
     *
     * Pre zobrazenie hlasky ze nie su ziadne vysledky
     */
    noResults:boolean
    /**
     * Hlaska o tom ze nie su ziadne vysledky, napr. "Žiadne typy podnikov"
     */
    noResultsMsg:string
  }

  interface IStateProps {
    //connect()
    isLoading?:boolean
    isLoadingTooLong?:boolean
    hasResponse?:boolean
    isErrorLoading?:boolean
    errorLoadingMsg?:string
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      isLoading: selectors.isLoading(state),
      isLoadingTooLong: selectors.isLoadingTooLong(state),
      isErrorLoading: selectors.isErrorLoading(state),
      errorLoadingMsg: selectors.getErrorLoadingMsg(state),
    }
  }

  /**
   * Na zaklade api stavu zobrazi niektoru z troch sprav
   *
   * - loading progress wait ikonka
   * - error loading
   * - ze nie su ziadne vysledky (ak nie je chyba a neprebieha nacitavanie)
   */
  @(connect(mapStateToProps) as any)
  class StatusMessages extends React.Component<IProps & IStateProps> {

    static defaultProps = {
      isLoadingCondition: true
    }

    render() {
      // console.log('*** LoadingStatus.render()', this.props);

      return (
        <div className="StatusMessages">

          {(this.props.isLoadingCondition && this.props.isLoading && this.props.isLoadingTooLong) && (
            <LoadingDiv/>
          )}

          {(this.props.isErrorLoading) && (
            <ErrorDiv
              errorMsg="Chyba spojenia"
              errorDetailMsg={this.props.errorLoadingMsg}
            />
          )}

          {(!this.props.isErrorLoading && !this.props.isLoading && this.props.noResults) && (
            <NoResultsDiv msg={this.props.noResultsMsg}/>
          )}

        </div>
      )
    }
  }

  return StatusMessages
}
