import * as React from "react";


interface IProps {
  value:number
  onChange:Function
  className?:string
  focus?:boolean

  /**
   * Ci sa zobrazuje na desktope, v tom pripade sa pouzije input type text namiesto input type number(?)
   */
  isDesktop?:boolean
}

interface IPriceInputState {
  stringValue:string
}

/**
 * Input na zadavanie ceny
 *
 * Pouziva sa desatinna ciarka. Automaticky vlozi ciarku po cisle. Obmedzuje 2 desatinne cisla.
 * Pouziva input type tel (namiesto text), kvoli Androidu, aby zobrazil big keyboard.
 * Input type number je nepouzitelne.
 *
 * Na IOS by sa dal pouzit input type text (detekovat IOS), lebo ajtak by bola big keyboard.
 * Na mobiloch by sa dalo pouzit input type number, ale stav by NESMEL pouzivat ciarku
 *
 * Neviem preco niekedy funguje hot-reload arrow-metody (onChange = (e) => {}) a niekedy nie
 */
export class PriceInput extends React.Component<IProps, IPriceInputState> {

  inputRef
  acceptedCharsRegex = /[0-9,\.]/
  state = {
    stringValue: '',
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.stringValue !== nextState.stringValue
  }

  componentWillMount() {
    this.receiveValue(this.props.value)
  }

  componentDidMount() {
    if (this.props.focus) {
      if (this.inputRef) {
        this.inputRef.focus()
      }
    }
  }

  componentWillReceiveProps(newProps) {
    this.receiveValue(newProps.value)
  }

  //ak sa dodana hodnota lisi od internej, tak ju prevezmeme
  receiveValue(newValue) {
    const currentNumericValue = this.toNumericValue(this.state.stringValue)
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

  //zamedzit ine znaky ako 0-9,.
  //berie all keys (backspace, shift...), pred onKeyPress
  //IOS ok: vola sa
  //Android: vola sa, ale e.key je Unidentified
  onKeyDown = (e) => {
    //toto nezafunguje na Androide, tam je e.key Unidentified
    if (1 === e.key.length && !this.acceptedCharsRegex.test(e.key)) {
      e.preventDefault()
    }

    //todo: overit android: toto nezafunguje na Androide, tam je e.key Unidentified
    //na IOS nie je Enter na Tel klavesnici. Na Android je.
    //todo: pri Esc vratit povodnu hodnotu
    if ('Enter' == e.key || 'Escape' == e.key) {
      if (this.inputRef) {
        this.inputRef.blur()
      }
    }

  }

  //po onKeyPress a po onChange
  //IOS ZLE: nevola sa
  //Android ok: vola sa
  //onKeyUp = (e) => {}

  //vola sa s printable chars only
  //IOS ok: vola sa
  //Android ZLE: nevola sa
  //onKeyPress = (e) => {}

  /**
   * Aby sa lahsie vymazavalo: aby bol kurzor na konci
   */
  onFocus = (e) => {
    window.setTimeout(this.cursorToEnd, 100) //s timeoutom funguje spolahlivejsie (aj PC aj IOS)
  }

  /**
   * On Blur: normalize value
   */
  onBlur = (e) => {
    const stringValueNormalized = this.toStringNormalizedValue(this.props.value)
    if (this.state.stringValue !== stringValueNormalized) {
      this.setState({
        stringValue: stringValueNormalized
      })
    }
  }

  onChange = (e) => {
    this.receiveStringValue(e.target.value)
  }

  onClickCapture = (e) => e.stopPropagation()

  cursorToEnd = () => {
    if (this.inputRef) {
      this.inputRef.selectionStart = 1000
      this.inputRef.selectionEnd = 1000
    }
  }

  receiveStringValue = (stringValue:string) => {
    stringValue = stringValue.replace('.', ',')

    //doplnit automaticky ","
    //pridavame znak, len ak sucasna hodnota je dlhsia ako ta predtym, t.j. nevymazavali sme
    if (stringValue.length > 0
      && -1 === stringValue.indexOf(',')
      && stringValue.length > this.state.stringValue.length) {
      stringValue += ','
      //posuv kurzora na koniec (asi len kvoli Androidu)
      window.setTimeout(this.cursorToEnd, 100)
    }

    //za ciarkou akceptovat len 2 znaky a ponechat len 1 ciarku
    if (-1 !== stringValue.indexOf(',')) {
      const splited = stringValue.split(',')
      if (splited[1]) {
        splited[1] = splited[1].substr(0, 2)
      }
      stringValue = splited.slice(0, 2).join(',')
    }

    if (stringValue === this.state.stringValue) {
      return
    }

    this.setState({
      stringValue: stringValue
    }, () => {
      const numericValue = this.toNumericValue(stringValue)
      if (numericValue !== this.props.value) {
        this.props.onChange(numericValue)
      }
    })
  }

  setRef = (r) => {
    this.inputRef = r
  }

  /**
   * Tato kombinacia atributov zabezpeci zobrazenie numerickej klavesnice na IOS
   * pattern="[0-9]*"
   * inputMode="numeric"
   *
   * Kvoli Androidu je lepsie type="tel"
   * Na mobiloch by sa hodilo type="number", ale tam by bol problem s "," ktoru pouzivame v stave
   * nesmie to byt na desktopoch kvoli ./, validacii
   *
   * https://www.filamentgroup.com/lab/type-number.html
   * https://github.com/uhlryk/react-dynamic-number
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
   * https://www.smashingmagazine.com/2015/05/form-inputs-browser-support-issue/
   * https://stackoverflow.com/questions/6178556/phone-numeric-keyboard-for-text-input
   * https://www.ctrl.blog/entry/html5-input-number-localization
   */
  render() {
    return (
      <input
        ref={this.setRef}
        className={this.props.className}
        type={this.props.isDesktop ? "text" : "tel"}
        size={6}
        pattern={this.props.isDesktop ? "[0-9,]*" : "[0-9]*"}
        placeholder="0,00"
        inputMode="numeric"
        value={this.state.stringValue}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClickCapture={this.onClickCapture}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
      />
    )
  }

}
