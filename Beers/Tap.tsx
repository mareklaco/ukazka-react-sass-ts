import * as React from "react";
import {connect} from "react-redux";
import {style} from "typestyle";
import {color} from "csx";
import * as cx from "classnames";
import {presets, spring} from 'react-motion'
import Transition from 'react-motion-ui-pack'
import {setEditTapAction, updateTapAction} from "./actions";
import {IBrandsById, IOldTypesById, IState, IStylesById, ITap} from "./interfaces";
import * as colors from "../colors";
import {shadowBoxStyle} from "../classes";
import {BEER_IMG_URL} from "./constants";
import {formatPrice} from "./functions";
import {PAGE_BASE_MARGIN} from "../Page/Page";
import {PriceInput} from "./PriceInput";
import {TapEditor} from "./TapEditor";


export const TAP_MARGIN = PAGE_BASE_MARGIN
const HIGHLIGHT_STAY_MS = 50
const HIGHLIGHT_FADE_OUT_AFTER_MS = 400
const HIGHLIGHT_FADE_OUT_DURATION_MS = 800
const EXEC_TIMEOUT_MS = 125

// const debugBorder = true
const debugBorder = false


const openEditorStyle = {
  opacity: 1,
  maxHeight: spring(35, presets.stiff),
}

const closeEditorStyle = {
  opacity: 0,
  maxHeight: 0,
}


const wrapperClass = style(
  {
    paddingTop: TAP_MARGIN / 2,
    paddingBottom: TAP_MARGIN / 2,
    paddingLeft: TAP_MARGIN,
    paddingRight: TAP_MARGIN,
    border: debugBorder && '1px solid red',
    $debugName: 'wrapper',
  },
)

const wrapperHighlightOnClass = style({
  backgroundColor: colors.iosSilver,
  filter: 'brightness(80%)',
  $debugName: 'wrapperHighlightOn',
})

const wrapperHighlightOffClass = style({
  backgroundColor: 'transparent',
  filter: 'brightness(100%)',
  transition: 'all ' + HIGHLIGHT_FADE_OUT_DURATION_MS / 1000 + 's',
  $debugName: 'wrapperHighlightOff',
})

const tapBgColor = colors.basic1
const tapClass = style(
  shadowBoxStyle,
  {
    backgroundColor: color(tapBgColor).toString(),
    //plastic background?
    // background: [
    //   '-webkit-gradient(linear, left bottom, left top, color-stop(0.4, #A02C28), color-stop(0.97, #C24B45), color-stop(0.98, #d4766e), color-stop(0.99, #C24B45))',
    //   'linear-gradient(bottom, #A02C28 40%, #C24B45 97%, #d4766e 98%, #C24B45 99%)',
    // ],
    fontSize: 18,
    color: colors.dark2,
    padding: 8,
    paddingRight: 12,
    cursor: 'default',
    userSelect: 'none',
    '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
    border: debugBorder && '2px solid silver',
    $debugName: 'tap',
  },
)

const mainRowClass = style({
  display: 'flex',
  border: debugBorder && '1px solid green',
  $debugName: 'mainRow',
})

const editorRowClass = style({
  border: debugBorder && '1px solid orange',
  borderTop: '1px solid silver',
  marginTop: 6,
  paddingTop: 6,
  $debugName: 'editorRow',
})

const imgColClass = style(
  {
    flex: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 5,
    border: debugBorder && '1px solid orange',
    $debugName: 'imgColClass',
    $nest: {
      img: {
        width: 24,
      }
    }
  },
)

const nameAndTypeColClass = style(
  {
    flex: 80,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: debugBorder && '1px solid green',
    $debugName: 'nameAndTypeColClass',
  },
)

const nameClass = style(
  {
    marginRight: 5, //aby stupnovitost bola odsadena dalej
    border: debugBorder && '1px solid cyan',
    $debugName: 'nameClass',
  },
)

const oldTypeClass = style(
  {
    whiteSpace: 'nowrap',
    // fontSize: '75%',
    // fontStyle: 'italic',
    // color: color(colors.dark2).lighten(0.15).toString(),
    border: debugBorder && '1px solid magenta',
    $debugName: 'oldTypeClass',
  },
)

//todo: low prio: cisla za ciarkou skusit zobrazit mensie
const priceColClass = style(
  {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    border: debugBorder && '1px solid red',
    $debugName: 'priceColClass',
  },
)

const expandColClass = style(
  {
    fontSize: 14,
    fontWeight: 'bold',
    // color: colors.iosGray,
    flex: 'initial',
    width: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    border: debugBorder && '1px solid black',
    $debugName: 'expandCol',
  },
)


const priceInputClass = style(
  {
    fontWeight: 'bold',
    color: colors.dark2,
    maxWidth: 75,
    padding: '2px 6px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    appearance: 'none',
    outline: 'none',
    textAlign: 'right',
    fontSize: 20,
    borderRadius: 0,
    boxSizing: 'border-box',
    // transition: 'all 0.15s', //pre focus
    cursor: 'text !important',
    $debugName: 'priceInputClass',
    $nest: {
      '&:hover': {
        // borderColor: 'gray',
        // backgroundColor: color('white').fadeOut(0.5).toString(),
        border: '1px solid silver',
        cursor: 'text !important',
      },
      '&::placeholder': {
        // color: color(colors.basic1).lighten(0.05).toString(),
        color: 'silver',
      },
      '&:focus': {
        // ...shadowBoxStyle,
        // ...shadowBoxFocusedStyle,
        border: '1px solid gray',
        backgroundColor: 'white',
        color: 'black',
        // transform: 'scale(1.1)',
        cursor: 'text !important',
      },
      '&:focus::placeholder': {
        color: 'transparent',
      },
    }
  },
)


interface IProps {
  tap:ITap
  hasPriceInput?:boolean
  /**
   * Ci sa Tap sam osebe vie Expandovat (a zobrazit TapEditor) a collapsovat
   */
  hasEditor?:boolean
  /**
   * Ci zobrazit ako faded a automaticky nechat odzniet
   *
   * (pri navrate na danu stranku)
   */
  fadeOutOnMount?:boolean
  onClick?:(e?) => any
  /**
   * Highlight ostane a po chvilke sa vykona akcia onClickHighlight
   *
   * (pouzit pri prechode na inu stranku)
   */
  onClickHighlight?:(e?) => any
  /**
   * Ci highight nechat pomaly odzniet
   *
   * (pouzit pri zostani na rovnakej stranke)
   */
  fadeOut?:boolean
  wrapperStyle?:any
  style?:any
  //connect
  isEditorOpen?:boolean
  brandsById?:IBrandsById
  oldTypesById?:IOldTypesById
  stylesById?:IStylesById
  dispatch?:Function
}

interface ILocalState {
  highlightOn:boolean
  highlightOff:boolean
}

const mapStateToProps = (state:IState, ownProps:IProps) => {
  return {
    isEditorOpen: state.editingTapKey == ownProps.tap.key,
    brandsById: state.brandsById,
    //todo: pouzit RichTap namiesto tychto tu
    oldTypesById: state.oldTypesById,
    stylesById: state.stylesById,
  }
}

/**
 * @todo: low prio: (?) property na ci, ci je cena editovatelna (pre desktop)
 */
@(connect(mapStateToProps) as any)
export class Tap extends React.Component<IProps, ILocalState> {

  state:ILocalState = {
    highlightOn: false,
    highlightOff: false,
  }

  timer

  componentWillMount() {
    if (this.props.fadeOutOnMount) {
      this.setState({
        highlightOn: true
      }, () => {
        this.timer = window.setTimeout(this.clearHighlightOn, HIGHLIGHT_FADE_OUT_AFTER_MS)
      })
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer = () => {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  }

  openEditor = () => {
    this.props.dispatch(setEditTapAction(this.props.tap))
  }

  closeEditor = () => {
    this.props.dispatch(setEditTapAction(null))
  }

  click = () => {
    if (this.props.hasEditor && !this.props.isEditorOpen) {
      this.openEditor()
    }
    this.props.onClick && this.props.onClick()
    if (this.props.onClickHighlight) {
      this.clearTimer()
      this.setState({
        highlightOn: true,
        highlightOff: false,
      })
      window.setTimeout(this.props.onClickHighlight, EXEC_TIMEOUT_MS)
      if (this.props.fadeOut) {
        this.timer = window.setTimeout(this.clearHighlightOn, HIGHLIGHT_STAY_MS)
      } else {
        //fallback, ak sa nebol prechod na novu stranku
        this.timer = window.setTimeout(this.clearHighlightOn, 4000)
      }
    }
  }

  clearHighlightOn = () => {
    this.setState({
      highlightOn: false,
      highlightOff: true,
    })
    this.timer = window.setTimeout(this.clearHighlightOff, HIGHLIGHT_FADE_OUT_DURATION_MS)
  }

  clearHighlightOff = () => {
    this.setState({
      highlightOff: false,
    })
  }

  setTapProp = (key:string, value:string | number | boolean) => {
    this.props.dispatch(updateTapAction({
        ...this.props.tap,
        [key]: value
      }
    ))
  }

  setPrice = (price:number) => {
    this.setTapProp('price', price)
  }

  render() {
    const t = this.props.tap
    return (
      <div
        className={cx(wrapperClass, {
          [wrapperHighlightOnClass]: this.state.highlightOn,
          [wrapperHighlightOffClass]: this.state.highlightOff,
        })}
        style={this.props.wrapperStyle}
      >
        <div
          className={tapClass}
          style={{
            ...this.props.style,
            cursor: (this.props.onClick || this.props.onClickHighlight || (this.props.hasEditor && !this.props.isEditorOpen)) ? 'pointer' : 'default'
          }}
          onClick={this.click}
        >

          <div className={mainRowClass}>

            <div className={imgColClass}>
              <img src={BEER_IMG_URL}/>
            </div>

            <div className={nameAndTypeColClass}>
            <span className={nameClass}>
              {(!!t.brandId) && (this.props.brandsById[t.brandId].name)}
            </span>
              <span className={oldTypeClass}>
              {(!!t.oldTypeId) && (this.props.oldTypesById[t.oldTypeId].replace(/ st$/, '°'))}
            </span>
            </div>

            <div className={priceColClass}>
              {(!!t.price && !this.props.hasPriceInput) && (formatPrice(t.price))}
              {(this.props.hasPriceInput) && (
                <PriceInput
                  className={priceInputClass}
                  value={this.props.tap.price}
                  onChange={this.setPrice}
                  isDesktop={true}
                />
              )}
            </div>

            {/*{(this.props.hasEditor) && (
              <div className={expandColClass}>
                <i className={"fa " + (this.props.tap.isEditorOpen ? "fa-chevron-up" : "fa-chevron-down")}/>
              </div>
            )}*/}

            {/*{(!!t.degrees) && (
              <span>
                {' '}
                {t.degrees}&deg;
              </span>
            )}*/}
            {/*{(!!t.styleId) && " (" + this.props.stylesById[t.styleId] + ")"}*/}

          </div>

          {(this.props.hasEditor) && (
            <Transition
              runOnMount={false}
              enter={openEditorStyle}
              leave={closeEditorStyle}
            >
              {(this.props.isEditorOpen) && (
                <div key={this.props.tap.key} style={{overflow: 'hidden'}}>
                  <div className={editorRowClass}>
                    <TapEditor tap={this.props.tap} onClose={this.closeEditor}/>
                  </div>
                </div>
              )}
            </Transition>
          )}

        </div>

      </div>
    )
  }

}
