import {style} from "typestyle";
import {color} from "csx";
import * as colors from "../../colors";


export const buttonClass = style({
  padding: '5px 10px !important',
  minHeight: '25px !important',
  transition: 'background-color 0.080s, color 0.080s',
  userSelect: 'none',
  '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
  $debugName: 'button',
  $nest: {
    //sipka dole/hore v tlacitku viac/menej
    '& > i': {
      fontSize: 15,
      margin: '0 4px',
    }
  }
})

export const buttonSecondaryClass = style({
  padding: '3px 8px !important',
  minHeight: '20px !important',
  $debugName: 'buttonSecondary',
  $nest: {
    '& > span': {
      fontSize: 12,
    }
  }
})

export const isActiveButtonClass = style({
  cursor: 'default !important',
  $debugName: 'isActive',
})

export const notActiveButtonClass = style({
  $debugName: 'notActive',
  $nest: {
    '&:hover': {
      backgroundColor: color(colors.iosSilver).darken(0.04).toString() + ' !important',
    }
  }
})

const disabledBgColor = color(colors.iosSilver).lighten(0.06).toString() + ' !important'
export const isDisabledButtonClass = style({
  cursor: 'not-allowed !important',
  color: 'silver',
  backgroundColor: disabledBgColor,
  $nest: {
    '&:hover': {
      backgroundColor: disabledBgColor,
    }
  },
  $debugName: 'isDisabled',
})

export const toggleButtonClass = style({
  backgroundColor: 'transparent !important',
  $debugName: 'isExpandedExpandButton',
  $nest: {
    '&:hover': {
      backgroundColor: color(colors.iosSilver).lighten(0.08).toString() + ' !important',
    }
  }
})
