import * as React from "react";


/**
 * Jednoduchy wrapper co prida xsBody prop
 *
 * Do zaobaleneho komponentu prida prop xsWindow true/false/null podla sirky window.
 * Sleduje onResize event.
 *
 * Alternativne riesenia:
 * - merat nie obrazovku, ale parent div ref width
 * - propagovat ako context (vid. makeFullscreen)
 * - pouzit https://github.com/souporserious/react-measure
 * - pouzit kniznice z react-measure
 */
export const xsBodyHOC = (WrappedComponent:typeof React.Component) => {

  interface IState {
    xsBody:boolean
  }

  class Wrapper extends React.Component<any, IState> {

    state:IState = {
      xsBody: null
    }

    // ref
    // setRef = (ref) => {
    //   this.ref = ref
    // }

    componentDidMount() {
      this.setWidth()
      window.addEventListener("resize", this.setWidth)
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.setWidth)
    }

    setWidth = () => {
      // if (this.ref) {
      //   const newWidth = this.ref.offsetWidth
      //   if (newWidth != this.state.width) {
      //     this.setState({
      //       width: newWidth
      //     })
      //   }
      // }

      //rovnako v combined.scss
      const $xsMaxWidth = 399.98

      const xsWindow = window.document.body.offsetWidth <= $xsMaxWidth

      if (xsWindow != this.state.xsBody) {
        this.setState({
          xsBody: xsWindow
        })
      }
    }

    render() {
      // console.log('~~~ xsWindowHOC.render()', this.props);
      // console.log('~~~ xsWindowHOC.render()', this.state);
      return (
        <WrappedComponent {...{
          xsBody: this.state.xsBody,
          ...this.props,
        }}/>
      )
    }
  }

  return Wrapper
}
