import * as React from "react";
import Transition from 'react-motion-ui-pack';


interface IProps {
  children?
}

interface IState {
  minHeight:number
  prevMinHeight:number
}

const CHECK_HEIGHT_AFTER_MS = 500
const CHANGE_TRESHOLD_PX = 100

/**
 * KeepHeight je wrapper ktoreho vyska neskace
 *
 * KeepHeight si pri zmenseni vysky deti na chvilu ponecha vyssiu vysku
 * a potom animaciou ju zmensi.
 *
 * Pouziva sa ako wrapper pre dinamicky loadovany content, aby pocas nacitavania zbytocne
 * prilis neskakala vyska.
 */
export class KeepHeight extends React.Component<IProps, IState> {

  state:IState = {
    minHeight: 0,
    prevMinHeight: 0,
  }

  ref
  updateTimer
  lastHeight = 0

  setRef = (r) => {
    this.ref = r
  }

  getHeight = () => {
    if (!this.ref) {
      return 0
    }
    const height = this.ref.clientHeight
    // console.log('~~~ KeepHeight.getHeight()', height);
    return height
  }

  updateMinHeight = () => {
    // console.log('~~~ KeepHeight.updateMinHeight()');

    const curHeight = this.getHeight()
    if (curHeight != this.lastHeight) {
      // console.log('~~~ KeepHeight.updateMinHeight() SKIP curHeight != this.lastHeight', curHeight, this.lastHeight);
      this.lastHeight = curHeight
      this.updateTimer = window.setTimeout(this.updateMinHeight, CHECK_HEIGHT_AFTER_MS)
      return
    }

    //zvacsit minHeight
    if (curHeight > this.state.minHeight) {
      // console.log('~~~ KeepHeight.updateMinHeight() ZVACSENIE');
      this.setStateHeights(curHeight)
      return;
    }

    //zmensit minHeight, a iba ak rozdiel je vacsi ako CHANGE_TRESHOLD_PX
    if (((curHeight + CHANGE_TRESHOLD_PX) < this.state.minHeight)) {
      // console.log('~~~ KeepHeight.updateMinHeight() ZMENSENIE');
      this.setStateHeights(curHeight)
      return;
    }

    // console.log('~~~ KeepHeight.updateMinHeight() NIC', curHeight, this.lastHeight, this.state);
  }

  setStateHeights = (newHeight) => {
    // console.log('~~~ KeepHeight.setStateHeights()', newHeight);
    this.setState({
      minHeight: newHeight,
      prevMinHeight: this.state.minHeight,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.updateTimer) {
      // console.log('~~~ KeepHeight.componentDidUpdate() CLEAR TIMER');
      window.clearTimeout(this.updateTimer)
    }
    // console.log('~~~ KeepHeight.componentDidUpdate() SET TIMER');
    this.updateTimer = window.setTimeout(this.updateMinHeight, CHECK_HEIGHT_AFTER_MS)

    //zvacsovat hned ako sa da
    const curHeight = this.getHeight()
    if (curHeight > this.state.minHeight) {
      this.setStateHeights(curHeight)
    }
  }

  render() {
    // console.log('~~~ KeepHeight.render()', this.state.minHeight, '(' + this.state.prevMinHeight + ')');

    //takato optimalizacia nefunguje kvoli ref, ktory sa odmountuje a primountuje a potom
    //neexistuje. Ale mozno by sa to dalo spravit, aby sa zbytocne neanimovalo zvysenie hodnoty.
    // if (this.state.prevMinHeight < this.state.minHeight) {
    //   return this.renderContent()
    // }

    return (
      <div style={{
        // border: '1px solid red',
        //rychly fallback bez animacie
        minHeight: this.state.minHeight,
      }}>
        {/*<div style={{color:'red', position: 'absolute'}}>{this.state.minHeight}px</div>*/}
        <Transition
          className="KeepHeight"
          runOnMount={false}
          enter={{
            minHeight: this.state.minHeight
          }}
          leave={{
            minHeight: this.state.prevMinHeight
          }}
        >
          <div key="key1" style={{minHeight: this.state.minHeight}}>
            <div ref={this.setRef}>
              {this.props.children}
            </div>
          </div>
        </Transition>
      </div>
    )
  }
}
