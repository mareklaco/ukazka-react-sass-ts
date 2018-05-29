import * as React from "react";
import {Children, cloneElement, Component, createElement} from "react";
import * as PropTypes from 'prop-types'
import {Motion, presets, spring} from 'react-motion'
import * as Measure from 'react-measure'

/**
 * Oproti povodnemu doplnena prop disableAppearAnimation
 * aby prvotny expanded stav sa zamerne neanimoval
 * https://github.com/souporserious/react-fluid-container/tree/0.6.0
 *
 * Mozno by bolo dobre pouzit typescriptovy tento fork:
 * https://github.com/DeviousM/react-fluid-container-typescript
 */
export class ReactFluidContainer060Patch extends Component<any, any> {
  static propTypes = {
    tag: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
    rmConfig: PropTypes.objectOf(PropTypes.number),
    children: PropTypes.node.isRequired,
    beforeAnimation: PropTypes.func,
    afterAnimation: PropTypes.func,
  }

  static defaultProps = {
    tag: 'div',
    height: 'auto',
    rmConfig: presets.noWobble,
    beforeAnimation: () => null,
    afterAnimation: () => null,
    disableAppearAnimation: false,
  }

  _heightReady
  _currHeight
  _firstMeasure
  _measureComponent

  constructor(props) {
    super(props)
    this.state = {
      height: 0,
    }
    this._heightReady = props.height !== 'auto'
    this._currHeight = null
    this._firstMeasure = true
  }

  componentDidUpdate(lastProps, lastState) {
    // if height has changed fire a callback before animation begins
    if (lastProps.height !== this.props.height) {
      this.props.beforeAnimation(lastProps.height, this.props.height)
    }

    // don't apply height until we have our first real measurement
    if (lastState.height > 0 || this.props.height > 0) {
      this._heightReady = true
    }
  }

  _handleMeasure = ({height}) => {
    // store the height so we can apply it to the element immediately
    // and avoid any element jumping
    if (height > 0) {
      this._currHeight = height
    }
    if (height !== this.state.height) {
      // don't fire callback on first measure
      if (!this._firstMeasure) {
        this.props.beforeAnimation(this.state.height, height)
      } else {
        this._firstMeasure = false
      }

      this.setState({height})
    }
  }

  _handleRest = () => {
    this.props.afterAnimation()
  }

  _handleInput = e => {
    const child = Children.only(this.props.children)

    this._measureComponent.measure()

    if (typeof child.props.onInput === 'function') {
      child.props.onInput(e)
    }
  }

  render() {
    const {
      tag,
      height,
      rmConfig,
      children,
      beforeAnimation,
      afterAnimation,
      disableAppearAnimation,
      ...restProps
    } = this.props
    const rmHeight = height === 'auto' ? this.state.height : height
    // console.log('rmHeight', rmHeight);
    const child = (
      <Measure
        ref={c => (this._measureComponent = c)}
        whitelist={['height']}
        onMeasure={this._handleMeasure}
      >
        {cloneElement(Children.only(children), {onInput: this._handleInput})}
      </Measure>
    )
    return (
      <Motion
        defaultStyle={{_height: rmHeight}}
        style={{
          _height: spring(rmHeight, {precision: 0.5, ...rmConfig}),
        }}
        onRest={this._handleRest}
      >
        {({_height}) => {
          // console.log(this._heightReady, _height, this._currHeight);
          return createElement(
            tag,
            {
              ...restProps,
              style: {
                height: this.props.disableAppearAnimation ? 'auto' : (this._heightReady
                    ? _height
                    : this._currHeight || 'auto'
                ),
                ...restProps.style,
              },
            },
            child
          )
        }}
      </Motion>
    )
  }
}
