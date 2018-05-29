import * as React from "react";
import {ICommand, Page} from "../../Page/Page";
import {connect} from "react-redux";
import Transition from 'react-motion-ui-pack'
import {IState, ITap} from "../interfaces";
import {deleteTapAction, deleteTapsRealAction, gotoPageAction, unDeleteTapAction} from "../actions";
import {DeleteWrapper} from "../DeleteWrapper";
import {Tap, TAP_MARGIN} from "../Tap";
import {PAGE} from "../constants";
import {PAGE_TRANS} from "../../Page/constants";
import {History} from "History";


interface IProps {
  //connect
  taps?:ITap[]
  history?:History
  dispatch?:Function
}

const mapStateToProps = (state:IState):IProps => {
  return {
    taps: state.taps,
  }
}

/**
 * Vymazavnie Tap-ov
 *
 * @todo: low prio: skusit animovat na odchode zo stranky skrytie delete-ikonky v DeleteWrapper
 */
// @withRouter
@(connect(mapStateToProps) as any)
export class DeleteTapsPage extends React.Component<IProps> {

  deleteTap = (tap:ITap) => {
    this.props.dispatch(deleteTapAction(tap))
  }

  unDeleteTap = (tap:ITap) => {
    this.props.dispatch(unDeleteTapAction(tap))
  }

  deleteTapsReal = () => {
    this.props.dispatch(deleteTapsRealAction())
  }

  hasDeleted = () => {
    return this.props.taps.some(t => t.isDeleted)
  }

  /**
   * Reset oznacenia piv na zmazanie
   */
  resetDeleted = () => {
    this.props.taps.filter(t => t.isDeleted).forEach(t => this.unDeleteTap(t))
  }

  goBack = () => {
    this.props.dispatch(gotoPageAction(PAGE.TapsPage, PAGE_TRANS.None))
  }

  doneCommand = {
    label: 'Hotovo',
    onClick: () => {
      this.goBack()
      this.resetDeleted()
    },
  }

  resetCommand:ICommand = {
    label: 'Obnov',
    green: true,
    onClick: this.resetDeleted,
  }

  confirmDeleteCommand() {
    const hasDeletedTaps = this.props.taps.some(t => t.isDeleted)
    return {
      label: 'Vymaž',
      onClick: hasDeletedTaps && this.deleteTapsReal,
      red: hasDeletedTaps,
    }
  }

  enterTapStyle = {
    opacity: 1,
    maxHeight: 150,
    translateX: 0,
  }

  leaveTapStyle = {
    opacity: 0,
    maxHeight: 0,
    translateX: -200,
  }

  render() {
    return (
      <Page
        title={this.props.taps.length ? "Vymazanie pív" : "Všetko vymazané"}
        leftCommand={this.hasDeleted() ? this.resetCommand : this.doneCommand}
        rightCommand={this.props.taps.length && this.confirmDeleteCommand()}
      >
        <Transition
          runOnMount={false}
          enter={this.enterTapStyle}
          leave={this.leaveTapStyle}
          style={{marginTop: TAP_MARGIN / 2}}
        >
          {this.props.taps.map(tap => (
            <DeleteWrapper
              key={tap.key}
              isDeleted={tap.isDeleted}
              onDelete={() => this.deleteTap(tap)}
              onUndelete={() => this.unDeleteTap(tap)}
            >
              <Tap tap={tap} wrapperStyle={{paddingRight: 0}}/>
            </DeleteWrapper>
          ))}
        </Transition>
      </Page>
    )
  }
}
