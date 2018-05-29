import * as React from "react";
import * as cx from "classnames";
import * as _ from "lodash";
import {ILikeButtonComponentState, ILikeButtonProps} from "./interfaces";
import {Avatar} from "../User";
import {createLogger} from "redux-logger";
import {dispatch, getLikeButtonState, likeButtonPropsToState, subscribe} from "./store";
import {likeAction} from "./actions";
import {IKnp} from "../interfaces";


declare var Knp:IKnp

/**
 * Komponent staci hockde umiestnit a poslat mu jeho props a on sam
 * sa napoji na "globalny" modulovy likeButtonsStore kde si udrzuje svoj stav a
 * pomocou Api modulu posiela requesty a aktualizuje sa.
 */
export class LikeButton extends React.Component<ILikeButtonProps, ILikeButtonComponentState> {

  unSubscribe


  onClick = () => {

    //null == nezalogovany user
    if (null == this.props.hasMyLike) {

      this.setState({
        showLoginWarning: true
      })

    } else {

      //netreba, pre istotu
      if (this.state.showLoginWarning) {
        this.setState({
          showLoginWarning: false
        })
      }

      //prvotne vytvorenie LikeButtonsStore
      if (!this.unSubscribe) {
        this.unSubscribe = subscribe(this.handleStateChange)
      }
      dispatch(likeAction(this.props.objType, this.props.refId))

    }
  }

  //propagovat zmenu taps cez props callback
  handleStateChange = () => {
    const likeButtonState = getLikeButtonState(this.props.objType, this.props.refId)
    // console.log('=== LikeButton.handleStateChange() got', likeButtonState);
    //moze byt undefined
    if (likeButtonState && !_.isEqual(likeButtonState, this.state)) {
      this.setState({gotMyLike: !this.state.hasMyLike && likeButtonState.hasMyLike})
      this.setState({isLoadingTooLong: undefined}) //reset
      this.setState({isLoadingError: undefined}) //reset
      this.setState(likeButtonState)
    }
  }

  //importovat do stavu data z props
  componentWillMount() {
    this.setState(likeButtonPropsToState(this.props))
  }

  componentWillUnmount() {
    if (this.unSubscribe) {
      this.unSubscribe()
    }
  }

  render() {
    // console.log('=== LikeButton.render()', this.props, this.state);
    const {hasMyLike, gotMyLike, likesCount, likedUsers} = this.state
    const displayNormally = (!this.state.isLoadingTooLong && !this.state.isLoadingError)
    const isMyObject = Knp.curUser && this.props.objAuthorId && (Knp.curUser.id == this.props.objAuthorId)
    return (
      <span className="LikeButton">
        <button
          type="button"
          className={cx("button", {
            hasMyLike,
            gotMyLike,
            isMyObject,
          })}
          title={isMyObject && 'Nedá sa lajkovať vlastný príspevok'}
          onClick={!isMyObject && this.onClick}
          disabled={isMyObject || this.state.showLoginWarning}
        >

          {(this.state.isLoadingError) && (
            <span>
              Chyba
            </span>
          )}

          {(this.state.isLoadingTooLong) && (
            <i className="fa fa-spin fa-spinner"/>
          )}

          {(displayNormally) && (
            <i className={cx("fa", "thumb", {
              'fa-thumbs-up': hasMyLike,
              'fa-thumbs-o-up': !hasMyLike,
            })}/>
          )}

          {(hasMyLike !== true) && (displayNormally) && (
            <span>
              Like
            </span>
          )}

        </button>

        {(this.state.showLoginWarning) && (
          <div className="needLoginWarning">
            Najprv sa <a href="uzivatelia/prihlasenie.php">prihlás</a>.
          </div>
        )}

        <div className="likedInfo">
          <span className="likedUsers">
            {likedUsers.map((u, i) => (
              <Avatar key={'' + i + '/' + u.id} user={u}/>
            ))}
          </span>
          {(likesCount > 0) && (
            <span className="likesCount">
              {likesCount}
            </span>
          )}
        </div>

      </span>
    )
  }
}
