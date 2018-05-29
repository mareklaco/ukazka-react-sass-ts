import * as React from "react";
import {color} from "csx";
import {Tabs} from "./Tabs";
import * as colors from "../colors";
import {Bar, ISegment, Pie} from "../presents";
import {SelectSegmentGraph} from "../statefull";


/**
 * Test komponent. Ukazka presents komponentov pre c.php
 *
 * @todo: pridat panel, panely, panelsGroup (ako ma pivny prehlad)
 */
export class Test extends React.Component {

  renderSegmentGraphs() {

    const segColors = []
    for (let i=0; i<10; i++) {
      segColors.push(
        color(colors.dark0).lighten(i * 0.09).toString()
      )
    }

    const segments:ISegment[] = [
      {
        label: 'Tretina',
        value: 33.333,
        color: segColors[0],
      },
      {
        label: 'Štvrtina',
        value: 25,
        color: segColors[1],
      },
      {
        label: 'Pätina',
        value: 20,
        color: segColors[2],
      },
      {
        label: 'Desatina',
        value: 10,
        color: segColors[3],
      },
      {
        label: 'Zvyšok',
        value: 100 - 33.333 - 25 - 20 - 10,
        color: segColors[4],
      },

      /*
      {
        label: 'Päť',
        value: 5,
        color: color(colors.dark).lighten(5 * 0.05).toString(),
      },
      /*{
        label: 'Šesť',
        value: 3,
        color: color(colors.dark).lighten(6 * 0.05).toString(),
      },
      {
        label: 'Sedem sedem',
        value: 2,
        color: color(colors.dark).lighten(7 * 0.05).toString(),
      },
      {
        label: 'Osem',
        value: 1,
        color: color(colors.dark).lighten(8 * 0.05).toString(),
      },*/


    ]
    return (
      <div>

        <div style={{margin: 20}}>
          <h2>Pie</h2>
          <div style={{
            maxWidth: 250,
            margin: '0 auto',
          }}>
            <Pie
              stroke={26}
              segments={segments}
              onClick={(i) => console.log('clicked pie', i)}
            />
          </div>
        </div>

        <div style={{margin: 20}}>
          <h2>Bar</h2>
          <Bar
            segments={segments}
            onClick={(i) => console.log('clicked bar', i)}
          />
        </div>

        <div style={{margin: 20}}>
          <h2>SelectSegmentGraph</h2>
          <div style={{
            maxWidth: 480,
            margin: '0 auto',
          }}>
            <SelectSegmentGraph
              segments={segments}
              onSelect={(i) => console.log('selected segment', i)}
            />
          </div>
        </div>

      </div>
    )
  }

  renderTabs() {
    return (
      <div style={{margin: 20}}>
        <h2>Tabs</h2>
        <Tabs
          activeId={null}
          onClick={(id) => console.log(id)}
          tabs={[
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
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderTabs()}
        {this.renderSegmentGraphs()}
      </div>
    )
  }
}
