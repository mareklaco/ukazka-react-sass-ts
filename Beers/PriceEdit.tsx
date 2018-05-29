import * as React from "react";
import * as cx from "classnames";
import {PAGE_BASE_MARGIN} from "../Page/Page";
import * as colors from "../colors";
import {style} from "typestyle";
import {formatPrice} from "./functions";
import {iosBlueButtonClass, iosButtonClass, iosButtonStyle, iosGreenButtonStyle, iosRedButtonClass} from "../classes";
import {PageSection} from "../Page/PageSection";
import {Button} from "./Button";


const ANI_DURATION_MS = 150
const HIGHTLIGHT_STAY_MS = 30


// const debugBorder = true
const debugBorder = false

const priceWrapperClass = style({
  margin: PAGE_BASE_MARGIN,
  fontSize: 48,
  fontWeight: 800,
  letterSpacing: 2,
  textAlign: 'center',
  transition: 'transform ' + ANI_DURATION_MS / 1000 + 's',
  border: debugBorder && '1px solid green',
  cursor: 'default',
  $debugName: 'wrapper',
})

const highlightOnClass = style({
  transform: 'scale(1.02)',
  $debugName: 'highlightOn',
})

const pricePlaceholderClass = style({
  position: 'relative',
  color: colors.iosSilver,
  border: debugBorder && '1px solid blue',
  $debugName: 'placeholder',
})

const priceClass = style({
  position: 'absolute',
  top: 0,
  left: 0,
  color: 'black',
  border: debugBorder && '1px solid red',
  borderRight: '1px solid #ccc',
  height: '100%', //musi byt, inak by prazdna cena nemala borderRight ziaden (kurzor ziaden)
  $debugName: 'price',
})

const BUTTON_WIDTH = 55
const BUTTON_HEIGHT = 40
const BUTTON_MARGIN = 5;
const keypadRowClass = style(
  {
    margin: '0 auto',
    width: BUTTON_WIDTH * 4 + BUTTON_MARGIN * 8,
    border: debugBorder && '1px solid orange',
    $debugName: 'keypadRow',
    $nest: {
      '& > button': {
        fontSize: 22,
        lineHeight: '10px',
        fontWeight: 300,
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        padding: 0,
        margin: 5,
        verticalAlign: 'middle',
        border: debugBorder && '1px solid cyan',
      },
      '& > button:last-of-type::after': {
        clear: 'both',
      },
      '& i': {
        fontSize: 22,
        lineHeight: '10px',
        border: debugBorder && '1px solid magenta',
      }
    }
  }
)

const okButtonClass = style(
  iosButtonStyle,
  iosGreenButtonStyle,
  {
    position: 'absolute',
    height: "" + (BUTTON_HEIGHT * 2 + BUTTON_MARGIN * 2) + "px !important",
  }
)

const zeroButtonClass = style(
  iosButtonStyle,
  {
    width: "" + (BUTTON_WIDTH * 2 + BUTTON_MARGIN * 2) + "px !important",
  }
)

interface IProps {
  price:number
  onChange:(price:number) => void
  onConfirm:(e?) => void
}

interface ILocalState {
  stringValue:string
  highlightOn:boolean
}

/**
 * Editovanie ceny (hocakej co pride zhora)
 */
export class PriceEdit extends React.Component<IProps, ILocalState> {

  state = {
    stringValue: '',
    highlightOn: false,
  }

  timer

  shouldComponentUpdate(nextProps:IProps, nextState:ILocalState) {
    // console.log('shouldComponentUpdate', this.state.stringValue !== nextState.stringValue, this.state.stringValue, nextState.stringValue, this.props.tap.price, nextProps.tap.price);
    return this.state.stringValue !== nextState.stringValue || this.state.highlightOn !== nextState.highlightOn
  }

  componentWillMount() {
    // console.log('componentWillMount', this.props.tap.price);
    this.receiveValue(this.props.price)
  }

  componentWillReceiveProps(newProps:IProps) {
    // console.log('componentWillReceiveProps', newProps.tap.price);
    this.receiveValue(newProps.price)
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer = () => {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  }

  //ak sa dodana hodnota lisi od internej, tak ju prevezmeme
  receiveValue(newValue:number) {
    // console.log('receiveValue', newValue);
    const currentNumericValue = this.toNumericValue(this.state.stringValue)
    // console.log('currentNumericValue', currentNumericValue, this.state.stringValue);
    if (currentNumericValue !== newValue) {
      this.setState({
        stringValue: this.toStringNormalizedValue(newValue)
      })
    }
  }

  toStringNormalizedValue(value:number) {
    if (!value) { //null|0
      return ''
    }
    return value.toFixed(2).replace('.', ',')
  }

  toNumericValue(value:string) {
    return parseFloat(value.replace(',', '.')) || null
  }

  receiveStringValue = (stringValue:string) => {
    stringValue = stringValue.replace('.', ',')

    //doplnit automaticky ","
    //pridavame znak, len ak sucasna hodnota je dlhsia ako ta predtym, t.j. nevymazavali sme
    if (stringValue.length > 0
      && -1 === stringValue.indexOf(',')
      && stringValue.length > this.state.stringValue.length) {
      stringValue += ','
    }

    //ak mame ciarku, tak za ciarkou akceptovat len 2 znaky a ponechat len 1 ciarku - tu poslednu
    if (-1 !== stringValue.indexOf(',')) {
      const splited = stringValue.split(',')
      let lastPart = splited.pop()
      if (lastPart) {
        lastPart = lastPart.substr(0, 2)
      }
      stringValue = splited.join('') + ',' + lastPart
    }

    //ak sa zadala ciarka na zaciatku => 0,
    if (',' == stringValue) {
      stringValue = '0,'
    }

    //odstranit zaciatocnu nulu nasledovanu cislom
    if (/^0\d/.test(stringValue)) {
      stringValue = stringValue.substr(1)
    }

    if (stringValue === this.state.stringValue) {
      return
    }

    this.clearTimer()

    this.setState({
      stringValue: stringValue,
      highlightOn: true,
    }, () => {
      const numericValue = this.toNumericValue(stringValue)
      if (numericValue !== this.props.price) {
        this.props.onChange(numericValue)
      }
    })
    this.timer = window.setTimeout(this.clearHighlightOn, ANI_DURATION_MS + HIGHTLIGHT_STAY_MS)
  }

  clearHighlightOn = () => {
    this.setState({
      highlightOn: false,
    })
  }

  onKeypadPress(char:string) {
    let stringValue = this.state.stringValue
    //backspace
    if ('B' === char) {
      stringValue = stringValue.slice(0, -1)
      //clear
    } else if ('C' === char) {
      stringValue = ""
    } else {
      stringValue += char
    }
    this.receiveStringValue(stringValue)
  }

  keypadButton(char:string, element?:JSX.Element) {
    const isClear = char == 'C'
    const isBack = char == 'B'
    const isClearOrBack = isClear || isBack
    const isOk = char == 'OK'
    const isZero = char == '0'
    const has2decimals = this.state.stringValue.length >= 3 && /,\d\d$/.test(this.state.stringValue)
    let isEnabled = isOk || (this.state.stringValue && isClearOrBack || !isClearOrBack && !has2decimals)
    if (',' == char && this.state.stringValue.substr(this.state.stringValue.length - 1, 1) == ',') {
      isEnabled = false
    }
    return (
      <Button
        className={isOk ? okButtonClass : (isClear ? iosRedButtonClass : (isBack ? iosBlueButtonClass : (isZero ? zeroButtonClass : iosButtonClass)))}
        disabled={!isEnabled}
        onClickFlash={!isOk && (() => this.onKeypadPress(char))}
        onClick={isOk && this.props.onConfirm}
      >
        {element || char}
      </Button>
    )
  }

  render() {
    return (
      <div>

        <div className={cx(priceWrapperClass, {
          [highlightOnClass]: this.state.highlightOn,
        })}>
          <span className={pricePlaceholderClass}>
            {formatPrice(this.toNumericValue(this.state.stringValue) || 0)}
            <span className={priceClass}>
              {this.state.stringValue}
            </span>
          </span>
        </div>

        <PageSection style={{marginTop: 0}}>
          <div className={keypadRowClass}>
            {this.keypadButton('7')}
            {this.keypadButton('8')}
            {this.keypadButton('9')}
            {this.keypadButton('B', <i className="fa fa-long-arrow-left"/>)}
          </div>
          <div className={keypadRowClass}>
            {this.keypadButton('4')}
            {this.keypadButton('5')}
            {this.keypadButton('6')}
            {this.keypadButton('C', <i className="fa fa-times"/>)}
          </div>
          <div className={keypadRowClass}>
            {this.keypadButton('1')}
            {this.keypadButton('2')}
            {this.keypadButton('3')}
            {this.keypadButton('OK', <i className="fa fa-check"/>)}
          </div>
          <div className={keypadRowClass}>
            {this.keypadButton('0')}
            {this.keypadButton(',')}
          </div>
        </PageSection>

      </div>
    )
  }
}
