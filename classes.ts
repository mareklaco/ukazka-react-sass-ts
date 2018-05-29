import {style} from "typestyle";
import {color} from "csx";
import * as colors from "./colors";
import * as types from 'typestyle/lib/types';


// const debugBorder = true
const debugBorder = false

export const mobileVertMedia = {
  maxWidth: 499,
}
export const mobileHorizAndUpMedia = {
  minWidth: 500,
}

export const warningColorStyle = {
  color: colors.iosRed,
}

const buttonBgColor = colors.dark0

const buttonStyle:types.NestedCSSProperties = {
  border: 'none',
  outline: 'none',
  borderRadius: 5,
  margin: 5,
  boxShadow: '0 2px #888',
  fontSize: 18,
  letterSpacing: 1,
  padding: '5px 20px',
  color: 'white',
  backgroundColor: buttonBgColor,
  cursor: 'pointer',
  $nest: {
    '&:hover': {
      backgroundColor: color(colors.dark0).darken(0.05).toString(),
    },
    '&:active': {
      boxShadow: '0 1px #666',
      transform: 'translateY(1px)',
      backgroundColor: color(colors.dark0).darken(0.1).toString(),
    },
  },
}

export const buttonClass = style(buttonStyle)

export const largeButtonClass = style(buttonStyle, {
  minWidth: 60,
  minHeight: 45,
  fontSize: 30,
  $debugName: 'largeButtonClass',
})

export const iosButtonStyle:types.NestedCSSProperties = {
  border: 'none',
  outline: 'none',
  borderRadius: 5,
  marginTop: 5, //left nie, aby dobre bol zahradeny v Pubforme
  marginBottom: 5,
  padding: '10px 20px',
  color: colors.iosBlue,
  backgroundColor: colors.iosSilver,
  cursor: 'pointer',
  userSelect: 'none',
  minHeight: 40, //aby aj bez ikonky malo tlacitko rovnaku vysku ako s ikonkou
  $debugName: 'iosButtonStyle',
  $nest: {
    '& > i': {
      fontSize: 20,
      verticalAlign: 'middle',
    },
    //span po i-cku
    '& > i + span': {
      marginLeft: 10,
      marginRight: 10,
    },
    '& > span': {
      fontSize: 13,
      letterSpacing: 0.5,
      verticalAlign: 'middle',
    },
    '&:disabled': {
      color: colors.iosGray,
      cursor: 'default',
    },
    //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
    // '&:hover': {
    //   backgroundColor: color(colors.iosSilver).darken(0.05).toString(),
    // },
    // '&:disabled:hover': {
    //   backgroundColor: colors.iosSilver,
    // },
    //toto riesi <Button>
    // '&:active': {
    //   transform: 'translateY(1px)',
    //   backgroundColor: color(colors.iosSilver).darken(0.1).toString(),
    // },
  },
}

export const iosButtonClass = style(iosButtonStyle)

export const iosGreenButtonStyle = {
  backgroundColor: colors.iosGreen,
  color: 'white',
  $debugName: 'iosGreenButton',
  $nest: {
    //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
    // '&:hover': {
    //   backgroundColor: color(colors.iosGreen).darken(0.05).toString(),
    // },
    // '&:disabled:hover': {
    //   backgroundColor: colors.iosGreen,
    // },
    //toto riesi <Button>
    // '&:active': {
    //   backgroundColor: color(colors.iosGreen).darken(0.1).toString(),
    // },
  },
}
export const iosGreenButtonClass = style(iosButtonStyle, iosGreenButtonStyle)

export const iosRedButtonClass = style(iosButtonStyle, {
  backgroundColor: colors.iosRed,
  color: 'white',
  $debugName: 'iosRedButtonClass',
  $nest: {
    //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
    // '&:hover': {
    //   backgroundColor: color(colors.iosRed).darken(0.05).toString(),
    // },
    // '&:disabled:hover': {
    //   backgroundColor: colors.iosRed,
    // },
    //toto riesi <Button>
    // '&:active': {
    //   backgroundColor: color(colors.iosRed).darken(0.1).toString(),
    // },
  },
})

export const iosBlueButtonStyle = {
  backgroundColor: colors.iosBlue,
  color: 'white',
  $debugName: 'iosBlueButton',
  $nest: {
    //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
    // '&:hover': {
    //   backgroundColor: color(colors.iosBlue).darken(0.05).toString(),
    // },
    // '&:disabled:hover': {
    //   backgroundColor: colors.iosBlue,
    // },
    //toto riesi <Button>
    // '&:active': {
    //   backgroundColor: color(colors.iosBlue).darken(0.1).toString(),
    // },
  }
}
export const iosBlueButtonClass = style(iosButtonStyle, iosBlueButtonStyle)

export const shadowBoxStyle:types.NestedCSSProperties = {
  boxShadow: '1px 1px 2px 0px rgba(171,171,171,0.8)',
  borderRadius: 3,
  //aby nazov piva nezvacsoval blok
  minWidth: 0,
  overflow: 'hidden',
}

export const shadowBoxFocusedStyle:types.NestedCSSProperties = {
  boxShadow: '0.5px 0.5px 1px 1px rgba(80,80,80,0.9)',
  borderRadius: 2,
}

export const shadowBoxWarningStyle:types.NestedCSSProperties = {
  boxShadow: '0.5px 0.5px 1px 1px ' + colors.iosRed,
}

/**
 * Horizontal+Vertical center
 */
export const flexCenterStyle:types.NestedCSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
