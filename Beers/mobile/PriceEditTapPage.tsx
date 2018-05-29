import * as React from "react";
import {Page} from "../../Page/Page";
import {connect} from "react-redux";
import {IRichTap, IState} from "../interfaces";
import * as Actions from "../actions";
import {getRichTap} from "../reducer";
import {scrollToTop} from "../../functions";
import {PriceEdit} from "../PriceEdit";
import {NoneTapPage} from "./NoneTapPage";


interface IProps {
  //connect
  tap?:IRichTap
}

const mapStateToProps = (state:IState):IProps => {
  return {
    tap: getRichTap(state.editingTapKey, state),
  }
}

/**
 * Editovanie ceny Tap-u
 */
@(connect(mapStateToProps, Actions as any) as any)
export class PriceEditTapPage extends React.Component<IProps> {

  componentWillMount() {
    scrollToTop()
  }

  setPrice = (price:number) => {
    this.props['setTapPriceAction'](price)
  }

  goBack = () => {
    this.props['gotoEditTapPageAction']()
  }

  goBackCommand = () => ({
    label: this.props.tap.brand.name,
    leftArrow: true,
    onClick: this.goBack,
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
        title="Cena piva"
        leftCommand={this.goBackCommand()}
      >

        <PriceEdit price={tap.price} onChange={this.setPrice} onConfirm={this.goBack}/>

        {/*<PageSection>
          <Tap tap={tap} style={{margin: 0}} onClick={() => this.props['gotoEditTapPageAction']()}/>
        </PageSection>*/}

        {/*<PageSection noContentMargin={true}>
          <PageRow title="Cena state">
            {this.state.stringValue}
          </PageRow>
          <PageRow title="Cena tap raw">
            {this.props.tap.price}
          </PageRow>
          <PageRow title="Cena tap format">
            {formatPrice(this.props.tap.price)}
          </PageRow>
          <PageRow
            title="Set 1.23"
            onClick={() => this.setPrice(1.23)}
          />
          <PageRow
            title="Set 2.46"
            onClick={() => this.setPrice(2.46)}
          />
          <PageRow
            title="Set 122.456"
            onClick={() => this.setPrice(122.456)}
          />
          <PageRow
            title="Set 0"
            onClick={() => this.setPrice(0)}
          />
          <PageRow
            title="Set null"
            onClick={() => this.setPrice(null)}
          />
          <PageRow
            title="Set undefined"
            onClick={() => this.setPrice(undefined)}
          />
          <PageRow
            title="Set NaN"
            onClick={() => this.setPrice(NaN)}
          />
        </PageSection>*/}

      </Page>
    )
  }
}
