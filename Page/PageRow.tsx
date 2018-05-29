import * as React from "react";
import * as cx from "classnames";
import {style} from "typestyle";
import {PAGE_BASE_MARGIN} from "./Page";
import * as colors from "../colors";


// const debugBorder = true
const debugBorder = false

const FONT_SIZE = 17

const HIGHTLIGHT_STAY_MS = 50
const HIGHLIGHT_FADE_OUT_AFTER_MS = 400
const HIGHLIGHTT_FADE_OUT_DURATION_MS = 600
const EXEC_TIMEOUT_MS = 125
const EXEC_TIMEOUT_AFTER_CLICKSTART_MS = 300


const rowClass = style({
  display: 'flex',
  fontSize: FONT_SIZE,
  color: 'black',
  border: debugBorder && '1px solid violet',
  cursor: 'default',
  '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
  position: 'relative',
  marginTop: -1, //na prekytie 1px borderu rowu nad nim - pocas highlightu
  $debugName: 'row',
  $nest: {
    '&:last-of-type > div': {
      borderBottom: 'none',
    },
    '& input': {
      fontSize: FONT_SIZE,
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: 0,
      appearance: 'none',
      outline: 'none',
      padding: 0,
      margin: 0,
      border: debugBorder ? '1px solid orange' : 'none',
    },
    '& select': {
      fontSize: FONT_SIZE,
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: 0,
      appearance: 'none',
      outline: 'none',
      padding: 0,
      margin: 0,
      border: debugBorder ? '1px solid orange' : 'none',
    },
  }
})

const row__highlightOnClass = style({
  backgroundColor: colors.iosSilver,
  $debugName: 'row__highlightOn',
})

const row__highlightOffClass = style({
  backgroundColor: 'transparent',
  transition: 'background-color ' + HIGHLIGHTT_FADE_OUT_DURATION_MS / 1000 + 's',
  $debugName: 'row__highlightOff',
})

const rowImgClass = style({
    marginLeft: PAGE_BASE_MARGIN,
    flex: 'initial',
    width: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: debugBorder && '1px solid orange',
    $nest: {
      img: {
        maxWidth: 24,
        maxHeight: 24,
      }
    }
  },
)

const rowBorderClass = style({
  flex: 'auto',
  marginLeft: PAGE_BASE_MARGIN,
  minHeight: 40,
  display: 'flex',
  border: debugBorder && '1px solid cyan',
  borderBottom: '1px solid ' + colors.iosBorder,
  $debugName: 'rowBorder',
})

const colTitleClass = style(
  {
    flex: 'auto',
    display: 'flex',
    alignItems: 'center',
    border: debugBorder && '1px solid red',
    $debugName: 'title',
  },
)

const colContentClass = style(
  {
    paddingRight: PAGE_BASE_MARGIN,
    flex: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#aaa',
    border: debugBorder && '1px solid blue',
    $debugName: 'content',
  },
)


const colCheckedClass = style(
  {
    paddingRight: PAGE_BASE_MARGIN,
    width: 20,
    flex: 'initial',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: colors.iosBlue,
    fontSize: 18,
    border: debugBorder && '1px solid red',
    $debugName: 'checked',
  },
)

const colArrowClass = style(
  {
    paddingRight: PAGE_BASE_MARGIN,
    width: 15,
    flex: 'initial',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: '#aaa',
    fontSize: 26,
    border: debugBorder && '1px solid red',
    $debugName: 'arrow',
  },
)


interface IProps {
  imgSrc?:string
  title?:string
  bold?:boolean
  arrow?:boolean
  checked?:boolean
  /**
   * Ci pri kliku zaroven zobrazit checkbox
   */
  checkOnClick?:boolean
  /**
   * Vykona sa hned, zaroven s animaciou
   *
   * (pouzit spolu s onClick, ktore sa vykona po chvilke)
   */
  onClickStart?:(e?) => void
  /**
   * Highlight ostane a po chvilke sa vykona akcia onClick
   *
   * (pouzit pri prechode na inu stranku)
   */
  onClick?:(e?) => void
  /**
   * Ci highight nechat pomaly odzniet
   *
   * (pouzit pri zostani na rovnakej stranke)
   */
  fadeOut?:boolean
  /**
   * Ci zobrazit ako faded a automaticky nechat odzniet
   *
   * (pri navrate na danu stranku)
   */
  fadeOutOnMount?:boolean
}

interface ILocalState {
  highlightOn:boolean
  highlightOff:boolean
  checked:boolean
}

export class PageRow extends React.Component<IProps, ILocalState> {

  state:ILocalState = {
    highlightOn: false,
    highlightOff: false,
    checked: false,
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

  click = () => {
    this.clearTimer()
    this.setState({
      highlightOn: true,
      highlightOff: false,
      checked: this.props.checkOnClick,
    })
    if (this.props.onClickStart) {
      this.props.onClickStart()
    }
    if (this.props.onClick) {
      const timeout = this.props.onClickStart ? EXEC_TIMEOUT_AFTER_CLICKSTART_MS : EXEC_TIMEOUT_MS
      window.setTimeout(this.props.onClick, timeout)
      //fallback, ak sa nepouzil fadeOut=true (a ostali sme na rovnakej stranke)
      this.timer = window.setTimeout(this.clearHighlightOn, 4000)
    }
    if (this.props.fadeOut) {
      this.timer = window.setTimeout(this.clearHighlightOn, HIGHTLIGHT_STAY_MS)
    }
  }

  clearHighlightOn = () => {
    this.setState({
      highlightOn: false,
      highlightOff: true,
    })
    this.timer = window.setTimeout(this.clearHighlightOff, HIGHLIGHTT_FADE_OUT_DURATION_MS)
  }

  clearHighlightOff = () => {
    this.setState({
      highlightOff: false,
    })
  }

  render() {
    const hasClickHandler = !!(this.props.onClickStart || this.props.onClick)
    return (
      <div
        className={cx(rowClass, {
          [row__highlightOnClass]: this.state.highlightOn,
          [row__highlightOffClass]: this.state.highlightOff,
          }
        )}
        onClick={hasClickHandler && this.click}
        style={hasClickHandler ? {cursor: 'pointer'} : {}}
      >
        {(this.props.imgSrc) && (
          <div className={rowImgClass}>
            <img src={this.props.imgSrc}/>
          </div>
        )}
        <div className={rowBorderClass}>
          {(!!this.props.title) && (
            <div
              className={colTitleClass}
              style={{fontWeight: this.props.bold ? 'bold' : undefined}}
            >
              {this.props.title}
            </div>
          )}
          <div className={colContentClass}>
            {this.props.children}
          </div>
          {(this.props.checked || this.state.checked) && (
            <div className={colCheckedClass}>
              <i className="fa fa-check"/>
            </div>
          )}
          {(this.props.arrow) && (
            <div className={colArrowClass}>
              <i className="fa fa-angle-right"/>
            </div>
          )}
        </div>
      </div>
    )
  }
}
