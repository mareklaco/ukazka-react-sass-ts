import * as React from "react";
import Transition from 'react-motion-ui-pack';
import {ReactFluidContainer060Patch} from './ReactFluidContainer060Patch';


interface IProps {
  expanded:boolean
  children?:any
}

/**
 * Plynulo rozbali/zbali a faduje deti podla prop expanded
 *
 * Pomocou FluidContainer a Transition
 *
 * Prvotny expanded stav sa zamerne NEanimuje (toto by sa dalo spravit parametricky, ale teraz je to takto)
 */
export class SlideDown extends React.Component<IProps> {

  enterStyle = {
    opacity: 1,
  }

  leaveStyle = {
    opacity: 0,
  }

  isInitialExpandedState = false

  componentWillMount() {
    this.isInitialExpandedState = this.props.expanded
  }

  componentWillReceiveProps(newProps:IProps) {
    if (newProps.expanded != this.props.expanded) {
      this.isInitialExpandedState = false
    }
  }

  render() {
    return (
      <div className="SlideDown">
        <ReactFluidContainer060Patch
          style={{overflow: 'hidden'}}
          height={this.props.expanded ? 'auto' : 0}
          disableAppearAnimation={this.isInitialExpandedState}
        >
          <Transition
            runOnMount={false}
            enter={this.enterStyle}
            leave={this.leaveStyle}
          >
            {(this.props.expanded) && (
              <div key="keyForTransition">
                {this.props.children}
              </div>
            )}
          </Transition>
        </ReactFluidContainer060Patch>
      </div>
    )
  }
}
