import * as React from "react";
import {Page} from "../../Page/Page";
import {connect} from "react-redux";
import {gotoPageAction} from "../actions";
import {PAGE} from "../constants";
import {scrollToTop} from "../../functions";
import {PAGE_TRANS} from "../../Page/constants";


interface IProps {
  //connect
  dispatch?:Function
}

/**
 * Zobrazit namiesto nejakej Tap-stranky ked Tap nie je v stave a teda nemame co zobrazit
 */
@(connect() as any)
export class NoneTapPage extends React.Component<IProps> {

  componentWillMount() {
    scrollToTop()
  }

  goTapsPage = () => {
    this.props.dispatch(gotoPageAction(PAGE.TapsPage, PAGE_TRANS.Back))
  }

  goTapsPageCommand = {
    label: 'Ponuka',
    leftArrow: true,
    onClick: this.goTapsPage
  }

  render() {
    return (
      <Page
        title="Nezvolené pivo"
        leftCommand={this.goTapsPageCommand}
      />
    )
  }

}
