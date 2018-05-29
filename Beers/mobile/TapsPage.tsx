import * as React from "react";
import {ICommand, Page, PAGE_BASE_MARGIN} from "../../Page/Page";
import {connect} from "react-redux";
import {Motion, spring} from 'react-motion'
import * as PropTypes from 'prop-types';
import {IState, ITap} from "../interfaces";
import {gotoEditTapPageAction, gotoPageAction, RESET_RECENTLY_ADDED_TAP} from "../actions";
import {iosBlueButtonClass, iosGreenButtonClass} from "../../classes";
import {Tap} from "../Tap";
import {PAGE} from "../constants";
import {scrollToTop} from "../../functions";
import {Button} from "../Button";
import {PAGE_TRANS} from "../../Page/constants";
import {pageHistoryGetLeaveCause} from "../../Page/reducer";
import {getTapByKey} from "../reducer";
import {PageSection} from "../../Page/PageSection";
import {History} from "History";


interface IProps {
  //connect
  taps?:ITap[]
  leaveCause?:any
  recentlyAddedTap?:ITap
  dispatch?:Function
  history?:History
}

const mapStateToProps = (state:IState):IProps => {
  return {
    taps: state.taps,
    leaveCause: pageHistoryGetLeaveCause(state.pageHistory),
    recentlyAddedTap: getTapByKey(state, state.recentlyAddedTapKey),
  }
}

// @withRouter
@(connect(mapStateToProps) as any)
export class TapsPage extends React.Component<IProps> {

  //pride z makeBeersApp
  static contextTypes = {
    fullscreenClose: PropTypes.func
  }

  addTap = () => {
    this.props.dispatch(gotoPageAction(PAGE.AddTapPage))
  }

  gotoEditTap = (tap:ITap) => {
    this.props.dispatch(gotoEditTapPageAction(tap, PAGE_TRANS.Forward, tap.key))
  }

  deleteCommand:ICommand = {
    icon: 'trash-o',
    onClick: () => {
      this.props.dispatch(gotoPageAction(PAGE.DeleteTapsPage, PAGE_TRANS.None))
    },
  }

  addCommand:ICommand = {
    icon: 'plus',
    onClick: this.addTap,
  }

  componentWillMount() {
    scrollToTop()
  }

  newTapAnimationDone = () => {
    this.props.dispatch({type: RESET_RECENTLY_ADDED_TAP})
  }

  renderTaps() {
    const newTap = this.props.recentlyAddedTap

    return (
      <div style={{marginTop: PAGE_BASE_MARGIN / 2}}>
        {newTap && (
          <Motion
            defaultStyle={{scale: 0}}
            style={{
              scale: spring(1, {stiffness: 130, damping: 15}),
            }}
            onRest={this.newTapAnimationDone}
          >
            {(styles) => (
              <Tap
                tap={newTap}
                onClickHighlight={(e) => this.gotoEditTap(newTap)}
                fadeOutOnMount={false}
                style={{
                  transform: 'scale(' + styles.scale + ')',
                }}
              />
            )}
          </Motion>
        )}
        {this.props.taps.filter(tap => !this.props.recentlyAddedTap || tap.key != this.props.recentlyAddedTap.key).map(tap => (
          <Tap
            key={tap.key}
            tap={tap}
            onClickHighlight={(e) => this.gotoEditTap(tap)}
            fadeOutOnMount={tap.key == this.props.leaveCause}
          />
        ))}
      </div>
    )
  }

  render() {
    return (
      <Page
        title="Ponuka pív"
        leftCommand={this.props.taps.length && this.deleteCommand}
        rightCommand={this.addCommand}
      >

        {this.renderTaps()}

        {/* === Pridaj pivo === */}
        <Button
          className={iosGreenButtonClass}
          onClick={this.addTap}
          style={{
            display: 'block',
            margin: '35px auto 0',
          }}
        >
          <i className="fa fa-plus"/>
          <span>
            Pridaj pivo
          </span>
        </Button>

        {/* === Zavri ponuku pív === */}
        {(this.context.fullscreenClose) && (
          <PageSection>
            <Button
              className={iosBlueButtonClass}
              onClick={this.context.fullscreenClose}
              style={{
                display: 'block',
                margin: '25px auto',
              }}
            >
              <i className="fa fa-compress"/>
              <span>
              Zavri ponuku pív
            </span>
            </Button>
          </PageSection>
        )}

      </Page>
    )
  }

}
