import * as React from "react";
import {Page} from "../../Page/Page";
import {connect} from "react-redux";
import {IOldTypesById, IRichTap, IState, IStylesById} from "../interfaces";
import {
  deleteTapAction, deleteTapsRealAction, gotoPageAction, gotoTypeEditPageAction,
  updateTapAction
} from "../actions";
import {PAGE} from "../constants";
import {getRichTap, stripRichTap} from "../reducer";
import {richTapToString} from "../functions";
import {iosGreenButtonClass} from "../../classes";
import {PageRow} from "../../Page/PageRow";
import {scrollToTop} from "../../functions";
import {PriceEdit} from "../PriceEdit";
import {Button} from "../Button";
import {PageSection} from "../../Page/PageSection";
import {PAGE_TRANS} from "../../Page/constants";
import {pageHistoryGetLeaveCause} from "../../Page/reducer";
import {NoneTapPage} from "./NoneTapPage";


interface IProps {
  //connect
  tap?:IRichTap
  leaveCause?:any,
  oldTypesById?:IOldTypesById
  stylesById?:IStylesById
  recentlyAddedTapKey?:string
  dispatch?:Function
  // history?:History
}

const mapStateToProps = (state:IState):IProps => {
  return {
    tap: getRichTap(state.editingTapKey, state),
    leaveCause: pageHistoryGetLeaveCause(state.pageHistory),
    oldTypesById: state.oldTypesById,
    stylesById: state.stylesById,
    recentlyAddedTapKey: state.recentlyAddedTapKey,
  }
}

/**
 * Editovanie Tap-u
 *
 * @todo: pre zvolenu znacku zobrazit jej bezne typy priamo vylistovane tu. Az dalsie typy budu na samost. stranke.
 */
// @withRouter
@(connect(mapStateToProps) as any)
export class EditTapPage extends React.Component<IProps> {

  componentWillMount() {
    scrollToTop()
  }

  setTapProp = (key:string, value:string | number) => {
    this.props.dispatch(updateTapAction({
      ...stripRichTap(this.props.tap),
        [key]: value
      }
    ))
  }

  setLitres = (litres:number) => {
    this.setTapProp('litres', litres)
  }

  setPrice = (price:number) => {
    this.setTapProp('price', price)
  }

  onChangeOldType = (e) => {
    this.setTapProp('oldTypeId', e.target.value)
  }

  onChangeStyle = (e) => {
    this.setTapProp('styleId', e.target.value)
  }

  goBack = () => {
    this.props.dispatch(gotoPageAction(PAGE.TapsPage, PAGE_TRANS.Back))
  }

  goBackCommand = {
    label: 'Ponuka',
    leftArrow: true,
    onClick: this.goBack
  }

  deleteCommand = {
    icon: 'trash-o',
    onClick: () => {
      if (confirm("Vymazať pivo z ponuky?")) {
        this.props.dispatch(deleteTapAction(this.props.tap))
        this.props.dispatch(deleteTapsRealAction())
        this.props.dispatch(gotoPageAction(PAGE.TapsPage, PAGE_TRANS.Back))
      }
    },
  }

  showAddTapButton() {
    return !!this.props.recentlyAddedTapKey
  }

  render() {
    const tap = this.props.tap

    if (!tap) {
      return (
        <NoneTapPage/>
      )
    }

    return (
      <Page
        title={richTapToString(tap)}
        leftCommand={this.goBackCommand}
        rightCommand={this.deleteCommand}
      >

        <PriceEdit price={tap.price} onChange={this.setPrice} onConfirm={this.goBack}/>

        <PageSection noContentPadding={true}>
          <PageRow
            title="Typ piva"
            arrow={true}
            onClick={() => this.props.dispatch(gotoTypeEditPageAction("oldType"))}
            fadeOutOnMount={"oldType" == this.props.leaveCause}
          >
            {tap.oldType}
          </PageRow>
        </PageSection>

        {/*<PageSection noContentMargin={true}>
          <PageRow title="Cena piva" arrow={true} onClick={() => this.props.dispatch(gotoPriceEditPageAction())}>
            {formatPrice(tap.price)}
          </PageRow>
          <PageRow title="Cena piva">
            <PriceInput value={tap.price} onChange={this.setPrice}/>
          </PageRow>
        </PageSection>*/}

        {/*<PageSection title="Ukazka">
          <Tap tap={tap} style={{margin: 0}}/>
        </PageSection>*/}

        {(this.showAddTapButton()) && (
          <Button
            className={iosGreenButtonClass}
            onClick={() => this.props.dispatch(gotoPageAction(PAGE.AddTapPage))}
            style={{
              display: 'block',
              margin: '35px auto',
            }}
          >
            <i className="fa fa-plus"/>
            <span>
              Ďalšie pivo
            </span>
          </Button>
        )}

      </Page>
    )
  }
}
