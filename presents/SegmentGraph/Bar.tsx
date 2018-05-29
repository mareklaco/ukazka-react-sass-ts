import * as React from "react";
import * as cx from "classnames";
import {ISegment} from "./interfaces";


interface IProps {
  segments:ISegment[]
  onClick:(index:number) => void
  activeIndex?:number
}

/**
 * Stateless Tycinkovy flexbox graf
 *
 * Na segmenty sa da klikat.
 */
export class Bar extends React.Component<IProps> {

  static defaultProps = {
    activeIndex: null,
  }

  render() {
    // console.log('~~~ Bar.render()', this.props);

    const activeIndex = this.props.activeIndex
    const segs = this.props.segments

    // const values = segs.map(s => s.value)
    // const sumValues = values.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
    // const percentValues = values.map(value => Math.ceil(100 * value / sumValues))

    const baseHeight = 40
    const heightOffset = 3

    return (
      <div
        className={cx("Bar", {
          activeSegment: null !== activeIndex
        })}
      >

        <ul style={{
          height: baseHeight, //musi byt ako height aktivneho segmentu, aby boli zvislo na stred
        }}>
          {segs.map((s, i) => (
            <li
              key={i}
              className={cx("segment", {
                active: i === activeIndex
              })}
              style={{
                backgroundColor: s.color,
                flex: s.value,
                height: baseHeight + (null === activeIndex ? -heightOffset : (i === activeIndex ? 0 : -2*heightOffset)),
              }}
              title={s.label + " " + s.value.toFixed() + "x"}
              onClick={() => this.props.onClick(i)}
            >
              <div
                className={cx("label", {
                  active: i === activeIndex
                })}
              >
                {s.label}
                {/* nezmesti sa to tam, tak nie */}
                {/*{(i === activeIndex) && (
                  <div>
                    {s.value.toFixed()}x
                  </div>
                )}*/}
              </div>
            </li>
          ))}
        </ul>

      </div>
    )
  }

}
