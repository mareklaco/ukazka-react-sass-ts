import * as React from "react";
import {HashRouter as Router} from "react-router-dom";
import {PageRouter} from "./PageRouter";
import {AnimatedPageRouter} from "../../Page/AnimatedPageRouter";


export class BeersMobile extends React.Component {

  maybePreventPullToRefresh = false
  lastTouchY = 0

  //Current versions of Chrome require setting the event's returnValue property.
  //Simply returning a string from the event handler won't trigger the alert.
  //https://stackoverflow.com/questions/4802007/window-onbeforeunload-not-working-in-chrome
  beforeunloadHandler(event) {
    event.returnValue = "Zatvoriť stránku s ponukou piva?"
  }

  //https://stackoverflow.com/questions/36212722/how-to-prevent-pull-down-to-refresh-of-mobile-chrome
  touchstartHandler(e) {
    if (e.touches.length != 1) return;
    this.lastTouchY = e.touches[0].clientY;
    //Pull-to-refresh will only trigger if the scroll begins when the
    //document's Y offset is zero.
    this.maybePreventPullToRefresh = window.pageYOffset == 0
  }

  touchmoveHandler(e) {
    var touchY = e.touches[0].clientY
    var touchYDelta = touchY - this.lastTouchY
    this.lastTouchY = touchY

    if (this.maybePreventPullToRefresh) {
      //To suppress pull-to-refresh it is sufficient to preventDefault the
      //first overscrolling touchmove.
      this.maybePreventPullToRefresh = false
      if (touchYDelta > 0) {
        e.preventDefault()
        return
      }
    }
  }

  componentWillMount() {
    //toto zial nefunguje na Mobile (funguje na Desktope)
    window.addEventListener("beforeunload", this.beforeunloadHandler)

    //zakazat pre chrome pull-down-to-refresh, tym ze sa zakaze scroll hore ak je pozicia 0
    //https://stackoverflow.com/questions/36212722/how-to-prevent-pull-down-to-refresh-of-mobile-chrome
    window.document.addEventListener("touchstart", this.touchstartHandler, {passive: false} as any)
    window.document.addEventListener("touchmove", this.touchmoveHandler, {passive: false} as any)
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeunloadHandler)
    window.document.removeEventListener("touchstart", this.touchstartHandler, {passive: false} as any)
    window.document.removeEventListener("touchmove", this.touchmoveHandler, {passive: false} as any)
  }

  render() {
    return (
      <Router>
        <AnimatedPageRouter pageRouter={PageRouter}/>
      </Router>
    )
  }
}

