import * as React from "react";
import {connect} from "react-redux";
import {style} from "typestyle";
import {IBrand, IState, ITap} from "./interfaces";
import {Tap, TAP_MARGIN} from "./Tap";
import {DeleteWrapper} from "./DeleteWrapper";
import {addTapAction, deleteTapAction, unDeleteTapAction} from "./actions";
import {brandsByNameSelector} from "./selectors";


const desktopClass = style({})

const tapsClass = style({
  //aby sa dorovnali marginy Tap-ov, aby boli jednotne
  paddingTop: TAP_MARGIN / 2,
  paddingBottom: TAP_MARGIN / 2,
})


interface IOwnProps {
}

interface IStateProps {
  //connect
  taps?:ITap[]
  allBrands?:IBrand[]
  dispatch?:Function
}

const mapStateToProps = (state:IState):IStateProps => {
  return {
    taps: state.taps,
    allBrands: brandsByNameSelector(state),
  }
}

// interface ILocalState {
//   isAddTapPageOpen:boolean
// }

/**
 * Appka pre Desktop
 */
@(connect(mapStateToProps) as any)
export class BeersDesktop extends React.Component<IOwnProps & IStateProps> {

  // state = {
  //   isAddTapPageOpen: false
  // }

  ref

  deleteTap = (tap:ITap) => {
    this.props.dispatch(deleteTapAction(tap))
  }

  unDeleteTap = (tap:ITap) => {
    this.props.dispatch(unDeleteTapAction(tap))
  }

  /*openAddTapPage = () => {
    this.setState({
      isAddTapPageOpen: true
    })
  }*/

  /*closeAddTapPage = () => {
    this.setState({
      isAddTapPageOpen: false
    })
  }*/

  /*closeCommand:ICommand = {
    label: 'Zavri',
    onClick: () => {
      this.props.dispatch(changeSearchBrandQueryAction(null))
      this.closeAddTapPage()
    },
  }*/

  componentDidMount() {
    //https://select2.org/programmatic-control/events
    if (jQuery().select2) {
      jQuery(this.ref).select2({
        language: {
          "noResults": function () {
            return "Nenašla sa taká značka piva"
          }
        }
      }).on('select2:select', (e) => {
        this.handleBrandsSelectChange(e)
        jQuery(this.ref).trigger('change')
      })
    }
  }

  saveRef = (r) => {
    this.ref = r
  }

  handleBrandsSelectChange = (e) => {
    const brandId = parseInt(e.target.value)
    if (brandId) {
      this.props.dispatch(addTapAction(brandId, true))
      this.ref.value = ""
    }
  }

  render() {
    return (
      <div className={desktopClass}>

        <div
          className={tapsClass}
        >
          {this.props.taps.map(tap => (
            <DeleteWrapper
              key={tap.key}
              isDeleted={tap.isDeleted}
              onDelete={() => this.deleteTap(tap)}
              onUndelete={() => this.unDeleteTap(tap)}
              clickableAll={false}
              doMountAnimation={false}
            >
              <Tap
                tap={tap}
                wrapperStyle={{paddingLeft: 0, paddingRight: 0}}
                hasPriceInput={!tap.isDeleted}
                hasEditor={!tap.isDeleted}
              />
            </DeleteWrapper>
          ))}
        </div>

        <div style={{marginTop: this.props.taps.length ? 15 : 0}}>
          <select ref={this.saveRef} onChange={this.handleBrandsSelectChange}>
            <option value="">=== vyber pivo ===</option>
            {this.props.allBrands.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/*{(this.state.isAddTapPageOpen) && (
          <AddTapPage
            leftCommand={this.closeCommand}
            onChooseBrand={this.closeAddTapPage}
          />
        )}*/}

        {/* === Pridaj pivo === */}
        {/*{(!this.state.isAddTapPageOpen) && (
          <Button
            className={iosGreenButtonClass}
            onClick={this.openAddTapPage}
            style={{
              display: 'block',
              margin: '25px auto',
            }}
          >
            <i className="fa fa-plus"/>
            <span>
              Pridaj pivo
            </span>
          </Button>
        )}*/}

      </div>
    )
  }
}
