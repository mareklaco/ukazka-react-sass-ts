import * as React from "react";
import {PropTypes} from "react";
import * as cx from "classnames";
import {style} from "typestyle";
import * as colors from "../colors";
import {flexCenterStyle} from "../classes";
import {scrollToTop} from "../functions";


export const PAGE_BASE_MARGIN = 14
const COMMAND_HIGHTLIGHT_STAY_MS = 125
const COMMAND_APPEAR_MS = 200 //aby sa ukazal komand postupne ked priskrolovala stranka
const COMMAND_OPACITY = 0.2 //stav clicked a stav appear
const HEADER_OPACITY_APPEAR_MS = 1250 //aby sa stal priesvitny header az ked odisla predosla Page prec

// const debugBorder = true
const debugBorder = false

const pageClass = style({
  fontSize: 20,
  paddingBottom: 25,
  backgroundColor: '#EFEFF4',
  border: debugBorder && '1px solid violet',
  $debugName: 'pageClass',
  $nest: {
    //A-cko bez href attributu, takze preto takto
    a: {
      color: colors.iosBlue,
      textDecoration: 'underline',
      cursor: 'pointer',
    }
  }
})

const page__desktopClass = style({
  position: 'relative',
})

export const headerClass = style({
  zIndex: 1000,
  display: 'flex',
  position: 'fixed',
  paddingLeft: PAGE_BASE_MARGIN,
  paddingRight: PAGE_BASE_MARGIN,
  overflow: 'hidden',
  top: 0,
  width: '100%',
  height: 38,
  boxSizing: 'border-box',
  userSelect: 'none',
  border: debugBorder && '1px solid blue',
  borderBottom: '1px solid ' + colors.iosBorder,
  backgroundColor: '#F7F7F7',
  cursor: 'default',
  //nastavene stylom (0.94/1)
  // opacity: 0.94,
  $debugName: 'headerClass',
})

const header__desktopClass = style({
  position: 'absolute',
})


const centerColClass = style(flexCenterStyle, {
  flex: 70,
  fontSize: 16,
  fontWeight: 600,
  //potrebne napriek flex, lebo sa vztahuje na DIV a provok pod nim moze byt sirsi
  textAlign: 'center',
  '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
  border: debugBorder && '1px solid gray',
  $debugName: 'centerClass',
})

const commandColClass = style({
  flex: 15,
  '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
  transition: 'opacity 0.3s',
  border: debugBorder && '1px solid silver',
  $debugName: 'command',
})

const commandCol__WoLinkClass = style({
  cursor: 'default',
  color: colors.iosGray,
  $debugName: 'commandCol__WoLinkClass',
})

const commandCol__WithLinkClass = style({
  cursor: 'pointer',
  color: colors.iosBlue,
  $debugName: 'commandCol__WoLinkClass',
})

const commandCol__fadeOutClass = style({
  opacity: COMMAND_OPACITY,
  $debugName: 'commandCol__highlightOnClass',
})

const commandLabelClass = style({
  fontSize: 16,
  textAlign: 'center',
  padding: '0px 8px',
  marginTop: 7,
  minWidth: 40,
  height: 25,
  whiteSpace: 'nowrap',
  lineHeight: '25px',
  display: 'inline-block',
  backgroundColor: colors.iosSilver,
  borderRadius: 5,
  border: debugBorder && '1px solid gray',
  position: 'relative',
  $debugName: 'commandLabelClass',
})

const commandLabel__RedClass = style({
  color: 'white !important',
  backgroundColor: colors.iosRed + ' !important',
  $debugName: 'commandLabel__Red',
  //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
  // $nest: {
  //   '&:hover': {
  //     backgroundColor: color(colors.iosRed).darken(0.05).toString() + ' !important',
  //   },
  // }
})

const commandLabel__GreenClass = style({
  color: 'white !important',
  backgroundColor: colors.iosGreen + ' !important',
  $debugName: 'commandLabel__Green',
  //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
  // $nest: {
  //   '&:hover': {
  //     backgroundColor: color(colors.iosGreen).darken(0.05).toString() + ' !important',
  //   },
  // }
})

const commandLabel__BlueClass = style({
  color: 'white !important',
  backgroundColor: colors.iosBlue + ' !important',
  $debugName: 'commandLabel__Blue',
  //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
  // $nest: {
  //   '&:hover': {
  //     backgroundColor: color(colors.iosBlue).darken(0.05).toString() + ' !important',
  //   },
  // }
})

const commandLabel__WithLinkClass = style({
  $debugName: 'commandLabel__WithLinkClass',
  //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
  // $nest: {
  //   '&:hover': {
  //     backgroundColor: color(colors.iosSilver).darken(0.05).toString(),
  //   },
  // }
})

const commandLabel__leftArrowClass = style({
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  $debugName: 'commandLabel__leftArrowClass',
  $nest: {
    //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
    // '&:hover:before': {
    //   borderRightColor: color(colors.iosSilver).darken(0.05).toString(),
    // },
    '&:before': {
      borderTop: '12px solid transparent',
      borderRight: '10px solid ' + colors.iosSilver,
      borderBottom: '12px solid transparent',
      height: 0,
      width: 0,
      position: 'absolute',
      left: -10,
      top: 1,
      content: `''`,
    },
  }
})

const iconBaseStyle = {
  lineHeight: '40px', //naschval nie vertical center, lebo centerColClass moze byt vyssi
  margin: '0px 7px',
  $debugName: 'iconClass',
  //hover je zbytocne pre mobil a len ostava v tomto stave na mobile, co je zle
  // $nest: {
  //   '&:hover': {
  //     color: color(colors.iosBlue).darken(0.1).toString(),
  //   }
  // },
}

const iconClass = style(
  iconBaseStyle,
  {
    fontSize: 24,
  }
)

const smallerIconClass = style(
  iconBaseStyle,
  {
    fontSize: 18,
  }
)

const contentClass = style({

  marginTop: 37, //to iste ako vyska Headru minus 1 (paddingTop)

  //proti collapsing margins
  paddingTop: 1,
  paddingBottom: 1,

  border: debugBorder && '1px solid green',
  $debugName: 'contentClass',
})

const content__desktopClass = style({
  marginTop: '0px !important',
  paddingTop: '38px !important',
})


export interface ICommand {
  icon?:string
  smallerIcon?:boolean,
  label?:string
  leftArrow?:boolean
  red?:boolean
  green?:boolean
  blue?:boolean
  onClick?:(e) => void
}


interface ICommandProps {
  command?:ICommand
  leftOrRight:"left" | "right"
}

interface ICommandState {
  fadeOut:boolean
  clicked:boolean
}

class Command extends React.Component<ICommandProps, ICommandState> {

  state:ICommandState = {
    fadeOut: true,
    clicked: false,
  }

  timer

  componentDidMount() {
    this.timer = window.setTimeout(this.fadeIn, COMMAND_APPEAR_MS)
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
    if (this.props.command.onClick) {
      this.clearTimer()
      this.setState({
        clicked: true,
      })
      window.setTimeout(this.props.command.onClick, COMMAND_HIGHTLIGHT_STAY_MS)
      this.timer = window.setTimeout(() => this.setState({clicked: false}), COMMAND_HIGHTLIGHT_STAY_MS * 2)
    }
  }

  fadeIn = () => {
    this.setState({
      fadeOut: false,
    })
  }

  render() {
    const command = this.props.command
    if (!command) {
      return (
        <div className={commandColClass}/>
      )
    }
    return (
      <div
        className={cx(commandColClass, {
          [commandCol__WoLinkClass]: !command.onClick,
          [commandCol__WithLinkClass]: !!command.onClick,
          [commandCol__fadeOutClass]: this.state.fadeOut,
        })}
        style={{
          textAlign: this.props.leftOrRight,
          opacity: this.state.clicked ? COMMAND_OPACITY : undefined,
        }}
        onClick={this.click}
      >
        {(!!command.label) && (
          <span className={cx(commandLabelClass, {
            [commandLabel__leftArrowClass]: command.leftArrow,
            [commandLabel__WithLinkClass]: !!command.onClick,
            [commandLabel__RedClass]: command.red,
            [commandLabel__GreenClass]: command.green,
            [commandLabel__BlueClass]: command.blue,
          })}>
            {command.label}
          </span>
        )}
        {(!!command.icon) && (
          <i className={cx("fa", "fa-" + command.icon, command.smallerIcon ? smallerIconClass : iconClass)}/>
        )}
      </div>
    )
  }
}


interface IProps {
  title:string | JSX.Element,
  titleColor?:string
  leftCommand?:ICommand
  rightCommand?:ICommand
  contentPadding?:boolean
  headerOpacity?:number
}

interface IPageLocalState {
  //pocas prvych sekund nebude header priesvitny, kvoli transition animacii lebo je pod nim predosla Page
  hasOpacity:boolean
}

/**
 * @todo: low prio: pouzit Apple font podla http://v1.designcode.io/iosdesign-guidelines
 */
export class Page extends React.Component<IProps, IPageLocalState> {

  //pride z BeersApp
  static contextTypes = {
    isDesktop: PropTypes.bool
  }

  state:IPageLocalState = {
    hasOpacity: false,
  }

  timer

  // nepouziva sa kvoli performance
  // static contextTypes = {
  //   pageHeaderOpacity: PropTypes.number,
  //   contentBrightness: PropTypes.number,
  // }

  componentDidMount() {
    this.timer = window.setTimeout(() => this.setState({hasOpacity: true}), HEADER_OPACITY_APPEAR_MS)
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer)
    }
  }

  render() {
    return (
      <div className={cx(pageClass, {
        [page__desktopClass]: this.context.isDesktop,
      })}>
        <div className={cx(headerClass, {
          [header__desktopClass]: this.context.isDesktop,
        })} style={{
          opacity: this.state.hasOpacity ? 0.94 : 1,
        }}>

          <Command command={this.props.leftCommand} leftOrRight="left"/>

          <div
            className={centerColClass}
            style={{
              color: this.props.titleColor,
            }}
            onClick={scrollToTop}>
            {this.props.title}
          </div>

          <Command command={this.props.rightCommand} leftOrRight="right"/>

        </div>
        <div className={cx(contentClass, {
          [content__desktopClass]: this.context.isDesktop,
        })}>
          {this.props.children}
        </div>
      </div>
    )
  }

}
