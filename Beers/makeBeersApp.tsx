import * as React from "react";
import {applyMiddleware, createStore, Store} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import createHistory from 'history/createHashHistory'
import {reducer} from "./reducer";
import {GOTO_PAGE_HISTORY, gotoPageReduxAction, loadConfigAction, loadDevTapsAction, loadTapsAction} from "./actions";
import {IBeersAppConfig, ITap} from "./interfaces";
import {PAGE_TRANS} from "../Page/constants";
import {PAGE} from "./constants";
import freeze = require("redux-freeze");


declare var process:any
declare var module:any
declare var require:any


/**
 * Zaobali BeersDesktop alebo BeersMobile tak aby mali Redux a ReactRouter
 */
export const makeBeersApp = (WrappedComponent:typeof React.Component) => {

  const makeRouterMiddleware = (history) => {
    return () => (next) => (action) => {
      if (GOTO_PAGE_HISTORY == action.type) {
        // console.log('!!! @@@ routerMiddleware: history.push', action.page, '(was: ' + history.location.pathname + ')');
        history.push(action.page)
      }
      return next(action)
    }
  }

  const history = createHistory()
  const routerMiddleware = makeRouterMiddleware(history)


  const logger = createLogger({
    diff: true,
    collapsed: true,
    // collapsed: (getState, action) => (action.type === LOAD_CONFIG),
  })


  const middleware = (process.env.NODE_ENV === 'production') ?
    [routerMiddleware, thunk] :
    [routerMiddleware, thunk, freeze, logger]


  const store:Store<any> = createStore(
    reducer,
    applyMiddleware(...middleware)
  )

  //reducers hot reload
  //https://github.com/reactjs/react-redux/releases/tag/v2.0.0
  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').reducer
      store.replaceReducer(nextRootReducer)
    })
  }

  interface IProps {
    config:IBeersAppConfig
    taps:ITap[]
    onChange:(taps:ITap[]) => void
    loadDevTaps?:boolean
  }


  /**
   */
  class BeersApp extends React.Component<IProps, any> {

    unsubscribeFromHistory
    unsubscribeFromState

    stateTaps

    componentWillMount() {
      if (this.props.config) {
        store.dispatch(loadConfigAction(this.props.config))
      }
      if (this.props.taps) {
        store.dispatch(loadTapsAction(this.props.taps))
      }
      if (this.props.loadDevTaps) {
        store.dispatch(loadDevTapsAction())
      }

      //goto initial url
      if (history.location.pathname != store.getState().pageHistory.location.pathname) {
        store.dispatch(gotoPageReduxAction(history.location.pathname as PAGE, PAGE_TRANS.None))
      }

      // console.log('^^^ BeersApp.componentWillMount()');
      this.unsubscribeFromHistory = history.listen(this.handleLocationChange)
      this.handleLocationChange(history.location)

      this.unsubscribeFromState = store.subscribe(this.handleStateChange)
      this.handleStateChange()
    }

    componentWillUnmount() {
      // console.log('^^^ BeersApp.componentWillUnmount()');
      if (this.unsubscribeFromHistory) {
        this.unsubscribeFromHistory()
      }
      if (this.unsubscribeFromState) {
        this.unsubscribeFromState()
      }
    }

    //toto umoznuje renderovat beersApp element znovu s novymi props (aplikovanie dat updatu)
    componentWillReceiveProps(newProps) {
      // console.log('^^^ BeersApp.componentWillReceiveProps()', newProps);
      if (newProps.taps) {
        store.dispatch(loadTapsAction(newProps.taps))
      }
    }

    handleLocationChange = (location) => {
      // console.log('^^^ BeersApp.handleLocationChange():', location);
      //ak aktualna URL je inaksia ako mame v stave, tak aktualizovat v stave sposobom Back
      //vraj sa neda rozlisit ci uzivatel tlacil Back alebo Forward v browseri
      //https://github.com/ReactTraining/history/issues/334#issuecomment-322740342
      if (location.pathname !== store.getState().pageHistory.location.pathname) {
        // console.log('^^^ update only state to: ', location.pathname, store.getState().pageHistory.location.pathname);
        store.dispatch(gotoPageReduxAction(location.pathname, PAGE_TRANS.Back))
      }
    }

    //propagovat zmenu taps cez props callback
    handleStateChange = () => {
      if (this.stateTaps !== store.getState().taps) {
        this.stateTaps = store.getState().taps
        this.props.onChange(this.stateTaps)
      }
    }

    clearConsole() {
      console && console.clear()
    }

    render() {
      return (
        <Provider store={store}>
          <div onDoubleClick={this.clearConsole}>
            <WrappedComponent/>
          </div>
        </Provider>
      )
    }
  }

  return BeersApp

}