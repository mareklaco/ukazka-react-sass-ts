import * as React from "react";
import Transition from 'react-motion-ui-pack'
import {headerClass} from "./Page";
import {spring} from "react-motion";
import {style} from "typestyle";
import {PAGE_TRANS} from "./constants";
import {IPageHistory, IStateWithPageHistory} from "./interfaces";
import {IState} from "../Beers/interfaces";
import {connect} from "react-redux";


//---

const aniPageClass = style({
  position: 'absolute',
  width: '100%',

  //aby pri prechode stranok nebolo vidiet predoslu vyssiu stranku
  backgroundColor: '#EFEFF4',
  height: '100vh',

  $debugName: 'aniPage',
})

interface IAnimatedPageProps {
  pageCounterOwn:number
  getPageCounterActual:Function
  style?
  children?
}


const AnimatedPage = (props:IAnimatedPageProps) => {
  //nerenderovat tretiu stranku v poradi
  if (props.pageCounterOwn < props.getPageCounterActual() - 1) {
    return null
  }
  const style = {
    ...props.style,
    //hodnotu translateX(0) a hodnoty blizke nula zmenit na "none" aby fungoval position:fixed na page header-i
    transform: props.style.transform.replace(/^translateX\(-?0.*/, 'none'),
    filter: 'brightness(' + props.style.brightness + '%)',
  }
  return (
    <div className={aniPageClass} style={style}>
      {props.children}
    </div>
  )
}


//---

interface IProps {
  pageRouter:Function
  //connect
  pageHistory?:IPageHistory
}

const mapStateToProps = (state:IState):IStateWithPageHistory => {
  return {
    pageHistory: state.pageHistory
  }
}

@(connect(mapStateToProps) as any)
export class AnimatedPageRouter extends React.Component<IProps> {

  ref
  refWidth:number

  setRef = (ref) => {
    this.ref = ref
  }

  //transform killuje position:fixed v detoch, je to tak podla specifikacie...
  //http://chenglou.github.io/react-motion/demos/demo5-spring-parameters-chooser/
  forwardNextPageStyleFn = () => ({
    translateX: this.getPageWidth(),
    brightness: 85,
  })

  forwardPrevPageStyle = {
    translateX: spring(-100, {stiffness: 40, damping: 24}),
    brightness: 85,
  }

  stillPageStyle = {
    translateX: 0,
    brightness: 100,
  }

  backNextPageStyle = {
    translateX: -100,
    brightness: 85,
  }

  backPrevPageStyleFn = () => ({
    translateX: this.getPageWidth(),
    brightness: 90,
  })

  getPageWidth() {
    return this.refWidth
  }

  componentDidMount() {
    this.setWidth()
    window.addEventListener("resize", this.setWidth)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setWidth)
  }

  setWidth = () => {
    if (this.ref) {
      this.refWidth = this.ref.offsetWidth
    }
  }

  appearStyle() {
    switch (this.props.pageHistory.curPageTrans) {
      case PAGE_TRANS.Forward:
        return this.forwardNextPageStyleFn()
      case PAGE_TRANS.Back:
        return this.backNextPageStyle
      case PAGE_TRANS.None:
      default:
        return this.stillPageStyle
    }
  }

  leaveStyle() {
    switch (this.props.pageHistory.curPageTrans) {
      case PAGE_TRANS.Forward:
        return this.forwardPrevPageStyle
      case PAGE_TRANS.Back:
        return this.backPrevPageStyleFn()
      case PAGE_TRANS.None:
      default:
        return this.stillPageStyle
    }
  }

  getPageCounterActual = () => {
    return this.props.pageHistory.pageCounter
  }

  render() {
    // console.log('### PageTransition.render():', this.props.pageHistory.location.pathname);

    const ph = this.props.pageHistory
    return (
      <div ref={this.setRef}>
        {/* header placeholder, aby zostavala viditelna horna lista pekne pocas transition */}
        <div
          className={headerClass}
          style={{
            zIndex: 0,
          }}/>
        <Transition
          runOnMount={false}
          appear={this.appearStyle()}
          enter={this.stillPageStyle}
          leave={this.leaveStyle()}
        >
          <AnimatedPage
            key={ph.pageCounter}
            pageCounterOwn={ph.pageCounter}
            getPageCounterActual={this.getPageCounterActual}
            style={{
              zIndex: ph.zIndex,
            }}
          >
            {this.props.pageRouter({location: ph.location})}
          </AnimatedPage>
        </Transition>
      </div>
    )
  }

}
