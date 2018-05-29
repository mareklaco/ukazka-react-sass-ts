import * as React from "react";
import {applyMiddleware, createStore, Store} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import {ITabmenuProps} from "../modules/Tabmenu";
import freeze = require("redux-freeze");


declare var process:any
declare var module:any
declare var require:any

/**
 * Vytvori redux app na zaklade makeModule a vyrenderuje componentName z modulu
 *
 * pre DEV: pouziva sa na skusanie modulov tvorenych makeXxxModule() fciami ako samost. app na c.php stranke
 *
 * @param makeModule  musi to byt named function a jej meno bez make/Module je nazov hlavneho komponentu
 */
export const makeModuleApp = (makeModule:Function, component:string):React.ComponentClass<any> => {

  if (typeof makeModule != 'function') {
    console.error('makeModuleApp: makeModule nie je fcia', makeModule)
    return
  }

  const logger = createLogger({
    diff: true,
    collapsed: true,
  })


  const middleware = (process.env.NODE_ENV === 'production') ?
    [thunk] :
    [thunk, freeze, logger]


  const prefix = (makeModule['name'] || 'mod').replace(/^make/, '').replace(/Module$/, '')
  const Module = makeModule(prefix, (state) => state)

  if (!Module.mainComponent) {
    console.error('makeModuleApp: modul nema mainComponent')
    return
  }

  const ModuleComponent = Module[component]

  if (!ModuleComponent) {
    console.error('makeModuleApp: neexistuje v module komponent', component)
    return
  }

  //kvoli Pubs modulu to musi byt V KONSTRUKTORE, inak by zle fungoval viac-krat pouzity
  // const store:Store<any> = createStore(
  //   Module.reducer,
  //   applyMiddleware(...middleware)
  // )


  /**
   */
  class ModuleApp extends React.Component<ITabmenuProps> {

    store:Store<any>

    //kvoli Pubs modulu to musi byt tu, inak by zle fungoval viac-krat pouzity
    //https://twitter.com/dan_abramov/status/716217178731765762
    //https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400
    constructor(props) {
      super(props)
      this.store = createStore(
        Module.reducer,
        applyMiddleware(...middleware)
      )
    }

    clearConsole() {
      console && console.clear()
    }

    render() {
      // console.log('^^^ ModuleApp.render()', componentName, this.props);
      return (
        <Provider store={this.store}>
          <div onDoubleClick={this.clearConsole}>
            <ModuleComponent {...this.props}/>
          </div>
        </Provider>
      )
    }
  }

  return ModuleApp
}