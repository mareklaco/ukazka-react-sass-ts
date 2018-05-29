import * as React from "react";
import {makeModuleApp} from "../../apps";
import {makePubsModule} from "../Pubs";


/**
 */
export class Custom1 extends React.Component {

  //tu lebo vytvorit az pri instancii PubsByType a nie pri importe modulu
  PubsApp

  constructor(props) {
    super(props)
    this.PubsApp = makeModuleApp(makePubsModule, 'Pubs')
  }

  render() {
    return (
      <div>
        <h1>Custom1 test component</h1>

        <h2>Jedlo podniky</h2>
        <this.PubsApp
          filter='Jedlo'
          regId={31}
          limit={1}
        />

        <h2>Minipivovary</h2>
        <this.PubsApp
          filter='Minipivovary'
          regId={31}
          limit={1}
        />

      </div>
    )
  }
}
