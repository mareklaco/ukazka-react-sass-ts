import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from 'prop-types';


declare var jQuery:JQueryStatic


/**
 * Zobrazi PlaceholderComponent a po kliknuti nan len FullscreenComponent
 *
 * Po kliknuti na PlaceholderComponent zbali celu stranku (obsah divu id=pageContentElementId)
 * a zobrazi len FullscreenComponent. Do kontextu posiela fciu fullscreenClose, aby nejaky
 * komponent vnutri mohol naspet uzavriet fullscreen rezim a vratit sa na zobrazenie PlaceholderComponent.
 *
 * Vyzaduje jQuery.
 */
export const makeFullscreen = (pageContentElementId:string, FullscreenComponent:typeof React.Component, PlaceholderComponent:typeof React.Component) => {

  /**
   * Vnutorny stav
   */
  interface IFullscreenState {
    isFullscreen:boolean
  }

  class FullscreenWrapper extends React.Component<null, IFullscreenState> {

    $fullscreenParent
    $pageContent
    $componentRoot
    $componentParent
    origScrollLeft
    origScrollTop
    origViewport

    state = {
      isFullscreen: false
    }

    //https://reactjs.org/docs/context.html
    static childContextTypes = {
      fullscreenClose: PropTypes.func,
    }

    getChildContext() {
      return {
        fullscreenClose: this.fullscreenClose,
      }
    }

    componentDidMount() {
      this.$fullscreenParent = jQuery("<div></div>").prependTo("body")
      this.$pageContent = jQuery("#" + pageContentElementId)
      this.$componentRoot = jQuery(ReactDOM.findDOMNode(this))
      this.$componentParent = this.$componentRoot.parent()
    }

    fullscreenOpen = () => {
      this.origScrollLeft = jQuery(window).scrollLeft()
      this.origScrollTop = jQuery(window).scrollTop()
      this.setState({
        isFullscreen: true
      }, () => {
        this.$pageContent.hide()
        jQuery(window.document.body).css({margin: 0})
        this.$fullscreenParent.append(this.$componentRoot)
        window.scrollTo(0, 0)
        this.origViewport = jQuery("#viewport").attr("content")
        jQuery("#viewport").attr("content",
          "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0")
      })
    }

    fullscreenClose = () => {
      this.setState({
        isFullscreen: false
      }, () => {
        this.$componentParent.append(this.$componentRoot)
        this.$pageContent.show()
        jQuery("#viewport").attr("content", this.origViewport)
        window.scrollTo(this.origScrollLeft, this.origScrollTop)
        //pre istotu timeout a este raz
        window.setTimeout(() => {
            window.scrollTo(this.origScrollLeft, this.origScrollTop)
          }, 250
        )
      })
    }

    render() {
      //je dvolezite aby <div> sa vzdy renderoval, kvoli ReactDOM.findDOMNode(this)
      return (
        <div>
          {(!this.state.isFullscreen)
            ? (
              <PlaceholderComponent {...{
                onStart: this.fullscreenOpen
              }}/>
            )
            : (
              <FullscreenComponent/>
            )
          }
        </div>
      )
    }
  }

  return FullscreenWrapper
}
