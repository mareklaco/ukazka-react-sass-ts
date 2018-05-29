import * as React from "react";
import {PropTypes} from "react";
import * as cx from "classnames";
import {connect} from "react-redux";
import * as colors from "../../colors";
import {IBrand, IState} from "../interfaces";
import {addTapAction, changeSearchBrandQueryAction, gotoPageAction} from "../actions";
import {SearchBrandResults} from "../SearchBrandResults";
import {style} from "typestyle";
import {color} from "csx";
import {warningColorStyle} from "../../classes";
import {firstSearchBrandResult, hasSearchBrandQuery, noSearchBrandResults} from "../reducer";
import {MostUsedBrands} from "../BrandsList";
import {scrollToTop} from "../../functions";
import {ICommand, Page, PAGE_BASE_MARGIN} from "../../Page/Page";
import {PAGE} from "../constants";
import {PageNote} from "../../Page/PageNote";
import {PAGE_TRANS} from "../../Page/constants";
import {History} from "History";


// const debugBorder = true
const debugBorder = false

const searchBeerInputWrapperClass = style(
  {
    // backgroundColor: colors.iosBorder,
    padding: '' + (PAGE_BASE_MARGIN / 2) + 'px ' + PAGE_BASE_MARGIN + 'px',
    transition: 'background-color 0.2s, padding 0.2s',
    border: debugBorder && '1px solid blue',
    $debugName: 'searchBeerInputWrapperClass',

    //uz zobrazujeme ako bol vtedy len fokusovany, kvoli prehladnosti
    paddingTop: PAGE_BASE_MARGIN,
    paddingBottom: PAGE_BASE_MARGIN,
    backgroundColor: color(colors.iosBorder).darken(0.1).toString(),
  })

const searchBeerInputWrapper__FocusClass = style({
  // paddingTop: PAGE_BASE_MARGIN,
  // paddingBottom: PAGE_BASE_MARGIN,
  // backgroundColor: color(colors.iosBorder).darken(0.1).toString(),
})

const addBeerNoResultsClass = style({
  $debugName: 'addBeerNoResultsClass',
  $nest: {
    input: warningColorStyle
  }
})

const searchBeerInputClass = style({
  display: 'block',
  padding: '4px 25%',
  // fontSize: 14,
  // height: 26,
  width: '100%',
  borderRadius: 8,
  textAlign: 'left',
  appearance: 'none',
  outline: 'none',
  backgroundColor: 'white',
  color: 'black',
  boxSizing: 'border-box',
  transition: 'all 0.3s',
  border: debugBorder ? '1px solid green' : '1px solid transparent',
  $debugName: 'searchBeerInputClass',

  //uz zobrazujeme ako bol vtedy len fokusovany, kvoli prehladnosti
  height: 32,
  fontSize: 16,

  $nest: {
    '&::placeholder': {
      color: '#bbb',
      textAlign: 'center',
    },
  }
})

const searchBeerInput__FocusClass = style({
  // height: 32,
  padding: '8px 12px',
  // fontSize: 16,
  $nest: {
    '&::placeholder': {
      textAlign: 'left',
    },
  }
})


interface IProps {
  //pre pouzitie z Desktopu
  leftCommand?:ICommand
  onChooseBrand?:Function
  //connect
  searchQuery?:string
  hasSearchQuery?:boolean
  noSearchResults?:boolean
  firstSearchBrandResult?:IBrand
  dispatch?:Function
  history?:History
}

const mapStateToProps = (state:IState):IProps => {
  return {
    searchQuery: state.searchBrandQuery,
    hasSearchQuery: hasSearchBrandQuery(state),
    noSearchResults: noSearchBrandResults(state),
    firstSearchBrandResult: firstSearchBrandResult(state),
  }
}

interface ILocalState {
  isFocused:boolean
}

/**
 * @todo ponuknut aj sekciu "piva z ponuky" aby uzivatel mohol lahko doplnit iny typ existujceho piva
 * @todo: low prio: pri focuse zobrazit ink "Cancel" ako ma IOS
 * @todo: low prio: ikonku lupy do animacie, ikonku vymazania vyhladavania ako ma IOS
 * @todo: low prio: pouzit uzsiu ikonku na X-ko zrusenia vyhladavania (ina znakova sada (awesome pro?))
 */
// @withRouter
@(connect(mapStateToProps) as any)
export class AddTapPage extends React.Component<IProps, ILocalState> {

  //pride z BeersApp
  static contextTypes = {
    isDesktop: PropTypes.bool
  }

  inputRef

  state = {
    isFocused: false
  }

  componentWillMount() {
    this.scrollToTopMobile()
  }

  componentDidMount() {
    // this.focus()
  }

  scrollToTopMobile = () => {
    if (!this.context.isDesktop) {
      scrollToTop()
    }
  }

  handleQueryChange = (e) => {
    this.props.dispatch(changeSearchBrandQueryAction(e.target.value))
  }

  chooseBrandId = (brandId:number) => {
    this.props.dispatch(addTapAction(brandId, this.context.isDesktop))
    this.props.onChooseBrand && this.props.onChooseBrand()
  }

  /**
   * Po stlaceni Enter akceptovat prvy vysledok
   */
  onKeyDown = (e) => {
    //todo: overit android: toto nezafunguje na Androide, tam je e.key Unidentified
    if ('Enter' == e.key) {
      if (this.inputRef) {
        this.inputRef.blur()
      }
      if (this.props.firstSearchBrandResult) {
        this.chooseBrandId(this.props.firstSearchBrandResult.id)
      }
    }
    if ('Escape' == e.key) {
      if (this.inputRef) {
        this.inputRef.blur()
      }
    }
  }

  focus = () => {
    if (this.inputRef) {
      this.inputRef.focus()
      window.setTimeout(this.scrollToTopMobile, 600) //na mobile az po tomto timeoute to zafunguje
    }
  }

  resetSearchQuery = () => {
    this.props.dispatch(changeSearchBrandQueryAction(null))
  }

  backCommand:ICommand = {
    label: 'Ponuka',
    leftArrow: true,
    onClick: () => {
      this.props.dispatch(gotoPageAction(PAGE.TapsPage, PAGE_TRANS.Back))
      // this.props.history.push('/')
      this.resetSearchQuery()
    },
  }

  searchFocusCommand:ICommand = {
    icon: 'search',
    smallerIcon: true,
    onClick: this.focus,
  }

  searchResetCommand:ICommand = {
    icon: 'times',
    smallerIcon: true,
    onClick: () => {
      this.resetSearchQuery();
      this.scrollToTopMobile()
    },
  }

  saveRef = (r) => {
    this.inputRef = r
  }

  onFocus = () => {
    this.setState({
      isFocused: true,
    })
  }

  onBlur = () => {
    this.setState({
      isFocused: false,
    })
  }

  asFocused = () => {
    return this.state.isFocused || this.props.hasSearchQuery
  }

  render() {
    return (
      <Page
        title={this.props.hasSearchQuery ? "Vyhľadávanie značiek" : "Pridať pivo"}
        leftCommand={this.props.leftCommand || this.backCommand}
        rightCommand={this.props.hasSearchQuery ? this.searchResetCommand : (!this.asFocused() && this.searchFocusCommand)}
      >

        <div className={cx(searchBeerInputWrapperClass, {
          [addBeerNoResultsClass]: this.props.noSearchResults,
          [searchBeerInputWrapper__FocusClass]: this.asFocused(),
        })}>
          <input
            ref={this.saveRef}
            type="text"
            className={cx(searchBeerInputClass, {
              [searchBeerInput__FocusClass]: this.asFocused(),
            })}
            placeholder="Hľadaj značku"
            value={this.props.searchQuery || ""}
            onChange={this.handleQueryChange}
            onKeyDown={this.onKeyDown}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        <SearchBrandResults onChange={this.chooseBrandId}/>

        {(!this.props.hasSearchQuery) && (
          <div>
            <MostUsedBrands onChange={this.chooseBrandId}/>
            <PageNote>
              Ďalšie značky: <a onClick={this.focus}>vyhľadávanie</a>
            </PageNote>
          </div>
        )}

        {/*<SpecialBrands onChange={this.chooseBrandId}/>*/}

      </Page>
    )
  }
}
