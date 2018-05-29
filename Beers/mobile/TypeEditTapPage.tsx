import * as React from "react";
import {Page} from "../../Page/Page";
import {connect} from "react-redux";
import {IOldTypesById, IRichTap, IState, IStylesById} from "../interfaces";
import * as Actions from "../actions";
import {getRichTap} from "../reducer";
import {PageSection} from "../../Page/PageSection";
import {PageRow} from "../../Page/PageRow";
import {scrollToTop} from "../../functions";
import {PAGE_TRANS} from "../../Page/constants";
import {NoneTapPage} from "./NoneTapPage";


interface IProps {
  //connect
  tap?:IRichTap
  oldTypesById?:IOldTypesById
  oldTypesIds?:number[]
  stylesById?:IStylesById
  recentlyAddedTapKey?:string
}

const mapStateToProps = (state:IState):IProps => {
  return {
    tap: getRichTap(state.editingTapKey, state),
    oldTypesById: state.oldTypesById,
    oldTypesIds: state.oldTypesIds,
    stylesById: state.stylesById,
    recentlyAddedTapKey: state.recentlyAddedTapKey,
  }
}

/**
 * Editovanie typu piva Tap-u
 *
 * @todo: po kliku maly timeout a hned navrat spet automaticky, lebo nema vyznam tu ostavat
 */
@(connect(mapStateToProps, Actions as any) as any)
export class TypeEditTapPage extends React.Component<IProps> {

  componentWillMount() {
    scrollToTop()
  }

  goBack = () => {
    this.props['gotoEditTapPageAction'](undefined, PAGE_TRANS.Back)
  }

  setOldTypeId(oldTypeId:number) {
    this.props['setTapOldTypeIdAction'](oldTypeId)
  }

  goBackCommand = () => ({
    label: this.props.tap.brand.name,
    leftArrow: true,
    onClick: this.goBack
  })

  render() {
    const tap = this.props.tap
    if (!tap) {
      return (
        <NoneTapPage/>
      )
    }
    return (
      <Page
        title="Typ piva"
        leftCommand={this.goBackCommand()}
      >

        <PageSection noContentPadding={true}>
          {this.props.oldTypesIds.map(id => (
            <PageRow
              key={id}
              title={this.props.oldTypesById[id]}
              checked={id == tap.oldTypeId}
              onClickStart={() => this.setOldTypeId(id)}
              onClick={this.goBack}
            />
          ))}
        </PageSection>

        {/*<PageSection>
          <Tap tap={tap} style={{margin: 0}} onClick={()=>this.props['gotoEditTapPageAction']()}/>
        </PageSection>*/}

      </Page>
    )
  }
}
