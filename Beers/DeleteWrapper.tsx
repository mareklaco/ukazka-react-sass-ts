import * as React from "react";
import * as cx from "classnames";
import {style} from "typestyle";
import {Motion, presets, spring} from 'react-motion'
import * as colors from "../colors";
import {PAGE_BASE_MARGIN} from "../Page/Page";


// const debugBorder = true
const debugBorder = false

const DELETE_COL_WIDTH = 40

const deleteWrapperClass = style({
  display: 'flex',
  userSelect: 'none',
  '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
  border: debugBorder && '1px solid blue',
  $debugName: 'deleteWrapperClass',
})

const deleteWrapper__clickableClass = style({
  $debugName: 'deleteWrapper__clickable',
  $nest: {
    '& *': {
      cursor: 'pointer !important',
    },
    '&:hover': {
      filter: 'brightness(96%)',
    },
  }
})

const childrenColClass = style(
  {
    flex: 90,
    border: debugBorder && '2px solid silver',
    $debugName: 'childrenColClass',
  },
)

//pre info:
//http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
//https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices

const deleteColor = colors.iosRed
const unDeleteColor = colors.iosGreen
const deleteColClass = style({
  width: DELETE_COL_WIDTH,
  display: 'flex',
  flex: 'initial',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  border: debugBorder && '1px solid orange',
  $nest: {
    i: {
      width: 20,
      height: 20,
      fontSize: 15,
      lineHeight: '21px',
      textAlign: 'center',
      border: debugBorder && '1px dotted red',
      color: deleteColor,
    },
  },
})

const deleteColClass__normal = style({})

const deleteColClass__isDeleting = style(
  {
    $nest: {
      i: {
        color: deleteColor,
      }
    }
  }
)

const deleteColClass__deleted = style(
  {
    $nest: {
      i: {
        color: unDeleteColor,
      },
      '&:hover > i': { //hm, tento riadok musi byt pritomny, aby bola recycle ikonka tociacasa - ZELENA
      },
    }
  }
)

const deleteColClass__isUnDeleting = style(
  {
    $nest: {
      i: {
        color: unDeleteColor,
      }
    }
  }
)

const defaultChildrenStyles = {
  scale: 1,
  grayscalePercent: 0,
  opacity: 1,
  iconRotate: 0,
}

const deletedChildrenStyles = {
  scale: 0.98,
  grayscalePercent: 100,
  opacity: 0.4,
  iconRotate: 360,
}

interface IProps {
  isDeleted:boolean
  onDelete:(e) => any
  onUndelete:(e) => any
  doMountAnimation?:boolean
  /**
   * Potrebne pre parent <Transition> v DeleteTapsPage ktory dodava styles
   */
  style?:any
  clickableAll?:boolean
}

interface ILocalState {
  mountAnimationDone:boolean
  isMotion:boolean
}

/**
 */
export class DeleteWrapper extends React.Component<IProps, ILocalState> {

  static defaultProps = {
    clickableAll: true,
    doMountAnimation: true,
  }

  state = {
    mountAnimationDone: false,
    isMotion: false,
  }

  startMotion = () => {
    this.setState({
      isMotion: true
    })
  }

  stopMotion = () => {
    this.setState({
      isMotion: false,
      mountAnimationDone: true
    })
  }

  componentWillReceiveProps(newProps:IProps) {
    if (this.props.isDeleted != newProps.isDeleted) {
      this.startMotion()
    }
  }

  render() {
    // const currentStyle = !this.props.isDeleted ? deletedChildrenStyles : defaultChildrenStyles
    const otherStyle = this.props.isDeleted ? deletedChildrenStyles : defaultChildrenStyles
    return (
      <Motion
        defaultStyle={{...otherStyle, deleteColWidth: PAGE_BASE_MARGIN}}
        style={{
          scale: this.state.isMotion ? spring(otherStyle.scale, presets.stiff) : otherStyle.scale,
          grayscalePercent: this.state.isMotion ? spring(otherStyle.grayscalePercent) : otherStyle.grayscalePercent,
          opacity: this.state.isMotion ? spring(otherStyle.opacity) : otherStyle.opacity,
          iconRotate: this.state.isMotion ? spring(otherStyle.iconRotate) : otherStyle.iconRotate,
          //animacia prvotneho zobrazenia deleteCol-u
          deleteColWidth: this.state.mountAnimationDone || !this.props.doMountAnimation
            ? DELETE_COL_WIDTH
            : spring(DELETE_COL_WIDTH, presets.stiff),
        }}
        onRest={this.stopMotion}
      >
        {(styles) => this.renderSelf(styles)}
      </Motion>
    )
  }

  renderSelf(styles) {
    const clickFn = !this.props.isDeleted ? this.props.onDelete : this.props.onUndelete
    return (
      <div
        className={cx(deleteWrapperClass, {
          [deleteWrapper__clickableClass]: this.props.clickableAll
        })}
        onClick={this.props.clickableAll && clickFn}
        style={this.props.style}
      >

        <div
          className={cx(childrenColClass)}
          style={{
            filter: 'grayscale(' + styles.grayscalePercent + '%)',
            transform: 'scale(' + styles.scale + ')',
            opacity: styles.opacity,
          }}
        >
          {this.props.children}
        </div>

        <div
          className={cx(deleteColClass, {
            [deleteColClass__normal]: !this.props.isDeleted && !this.state.isMotion,
            [deleteColClass__isDeleting]: this.props.isDeleted && this.state.isMotion,
            [deleteColClass__isUnDeleting]: !this.props.isDeleted && this.state.isMotion,
            [deleteColClass__deleted]: this.props.isDeleted && !this.state.isMotion,
          })}
          style={{width: styles.deleteColWidth}}
        >
          <i
            className={cx("fa", {
              'fa-minus-circle': !this.props.isDeleted && !this.state.isMotion || this.props.isDeleted && this.state.isMotion,
              'fa-undo': this.props.isDeleted && !this.state.isMotion || !this.props.isDeleted && this.state.isMotion,
            })}
            style={{
              transform: 'rotate(' + styles.iconRotate + 'deg)',
              cursor: !this.props.clickableAll ? 'pointer' : undefined,
            }}
            onClick={!this.props.clickableAll && clickFn}
          />
        </div>

      </div>
    )
  }

}
