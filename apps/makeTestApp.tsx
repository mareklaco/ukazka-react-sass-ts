import * as React from "react";
import {applyMiddleware, combineReducers, createStore, Store} from "redux";
import {connect, Provider} from "react-redux";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {ITabmenuTab, makeTabmenuModule} from "../modules/Tabmenu";
import {Tabs} from "../presents/Tabs";
import freeze = require("redux-freeze");


declare var process:any
declare var module:any
declare var require:any


interface ITestProps {
  tabs:ITabmenuTab[]
}


/**
 * len pre demo ucel
 */
export const makeTestApp = ():React.ComponentClass<ITestProps> => {

  const getTabmenu1State = (state) => state.Tabmenu1
  const tabmenuModule1 = makeTabmenuModule('Test/Tabmenu1', getTabmenu1State)

  const getTabmenu2State = (state) => state.Tabmenu2
  const tabmenuModule2 = makeTabmenuModule('Test/Tabmenu2', getTabmenu2State)

  const reducer = combineReducers({
    Tabmenu1: tabmenuModule1.reducer,
    Tabmenu2: tabmenuModule2.reducer,
  })

  const logger = createLogger({
    diff: true,
    collapsed: true,
  })

  const middleware = (process.env.NODE_ENV === 'production') ?
    [thunk] :
    [thunk, freeze, logger]

  const store:Store<any> = createStore(
    reducer,
    applyMiddleware(...middleware)
  )

  interface IStateProps {
    currentTab1?:ITabmenuTab
    currentTab2?:ITabmenuTab
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      currentTab1: tabmenuModule1.getCurrentTab(state),
      currentTab2: tabmenuModule2.getCurrentTab(state),
    }
  }

  /**
   * Test aplikacia - test modulov pre c.php
   */
  @(connect(mapStateToProps) as any)
  class Test extends React.Component<ITestProps & IStateProps> {
    render() {
      // console.log('*** Test.render()', this.props);
      return (
        <div>

          <Tabs activeId={null} onClick={(id) => console.log(id)} tabs={[
            {
              id: 'A',
              title: 'Tab A',
              xsTitle: 'T.A'
            },
            {
              id: 'B',
              title: 'Tab B',
              xsTitle: 'T.B'
            },
            {
              id: 'C',
              title: 'Tab C'
            },
          ]}
          />

          <br/>
          <br/>

          <tabmenuModule1.Tabmenu
            tabs={this.props.tabs}
          />
          [currentTab1: {this.props.currentTab1 && this.props.currentTab1.title}]<br/>

          <br/>
          <br/>

          <tabmenuModule2.Tabmenu
            tabs={this.props.tabs}
            disabled={false}
          />
          [currentTab2: {this.props.currentTab2 && this.props.currentTab2.title}]<br/>

        </div>
      )
    }
  }


  class TestApp extends React.Component<ITestProps, any> {

    clearConsole() {
      console && console.clear()
    }

    render() {
      // console.log('*** TestApp.render()', this.props);
      return (
        <Provider store={store}>
          <div onDoubleClick={this.clearConsole}>
            <Test {...this.props}/>
          </div>
        </Provider>
      )
    }
  }

  return TestApp
}
