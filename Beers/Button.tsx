import * as React from "react";
import * as cx from "classnames";
import {style} from "typestyle";


const ANI_DURATION_MS = 100
const COMMAND_TIMEOUT_MS = 100
const HIGHTLIGHT_STAY_MS = 30

const buttonClass = style({
  '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
  transition: 'all ' + ANI_DURATION_MS / 1000 + 's',
  $debugName: 'button',
})

const highlightOnClass = style({
  filter: 'brightness(90%)',
  transform: 'scale(1.15)',
  $debugName: 'highlightOn',
})

interface IProps {
  className?:string
  style?
  disabled?:boolean
  /**
   * Highlight ostane a po chvilke sa vykona akcia
   *
   * (pouzit pri prechode na inu stranku)
   */
  onClick?:(e?) => void
  /**
   * Akcia sa vykona hned a highlight preblikne
   *
   * (pouzit pri zostani na rovnakej stranke)
   */
  onClickFlash?:(e?) => void
}

interface ILocalState {
  highlightOn:boolean
}

/**
 * Prerobit API namiesto onClickFlash pouzit fadeOut:boolean
 */
export class Button extends React.Component<IProps, ILocalState> {

  state:ILocalState = {
    highlightOn: false,
  }

  timer

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
    })
    if (this.props.onClick) {
      window.setTimeout(this.props.onClick, ANI_DURATION_MS + COMMAND_TIMEOUT_MS)
      //fallback, ak sa pouzil onClick namiesto onClickFlash
      this.timer = window.setTimeout(this.clearHighlightOn, 3000)
    }
    if (this.props.onClickFlash) {
      this.props.onClickFlash()
      this.timer = window.setTimeout(this.clearHighlightOn, ANI_DURATION_MS + HIGHTLIGHT_STAY_MS)
    }
  }

  clearHighlightOn = () => {
    this.setState({
      highlightOn: false,
    })
  }

  render() {
    return (
      <button
        type="button"
        className={cx(this.props.className, buttonClass, {
            [highlightOnClass]: this.state.highlightOn,
          }
        )}
        onClick={this.click}
        style={this.props.style}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    )
  }
}
