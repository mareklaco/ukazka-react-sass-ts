import * as React from "react";
import * as cx from "classnames";
import * as colors from "../../colors";
import {ISegment} from "./interfaces";


interface IProps {
  stroke:number
  segments:ISegment[]
  onClick:(index:number) => void
  activeIndex?:number
  rotateAngle?:number
}

/**
 * Stateless kolacovy SVG graf s kruhom v strede
 *
 * Na segmenty sa da klikat - zavola sa CB.
 *
 * https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
 */
export class Pie extends React.Component<IProps> {

  static defaultProps = {
    activeIndex: null,
    rotateAngle: 0,
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  describeArc(x, y, radius, startAngle, endAngle):string {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }

  render() {
    // console.log('~~~ Pie.render()', this.props);

    const activeIndex = this.props.activeIndex
    const segs = this.props.segments
    const values = segs.map(s => s.value)

    const sumValues = values.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
    // const percentValues = values.map(value => Math.ceil(100 * value / sumValues))

    let startAngle, endAngle
    startAngle = endAngle = this.props.rotateAngle

    const angles = values.map(value => {
      startAngle = endAngle
      if (sumValues) {
        endAngle += 360 * Math.abs(value) / sumValues
      }
      return {
        startAngle,
        endAngle: endAngle - 0.001
      }
    })

    return (
      <svg
        className={cx("Pie", {
          activeSegment: null !== activeIndex
        })}
        viewBox="0 0 100 100"
      >

        {/* vonkrajsi kruh: netreba */}
        {/*<circle r={50} cx={50} cy={50} style={{fill: '#E6E6E6'}}/>*/}

        {/* stredovy kruh: biely ak je aktivny segment */}
        {(activeIndex !== null) && (
          <circle
            r={50 - this.props.stroke + 4}
            cx={50}
            cy={50}
            style={{fill: 'white'}}
          />
        )}

        {angles.map((a, i) => (
          <path
            key={i}
            className="segment"
            onClick={() => this.props.onClick(i)}
            fill="none"
            stroke={segs[i].color || colors.neutr3}
            strokeWidth={this.props.stroke + (null === activeIndex ? -2 : (i === activeIndex ? 0 : -4))}
            d={this.describeArc(50, 50, 50 - this.props.stroke / 2, a.startAngle, a.endAngle)}
          />
        ))}

        {/*{(activeIndex !== null) && (
          <text
            className="centerLabel1"
            x={50}
            y={54}
            style={{fill: segs[activeIndex].color}}
          >
            {segs[activeIndex].value.toFixed() + "x"}
          </text>
        )}

        {(activeIndex !== null) && (
          <text
            className="centerLabel2"
            x={50}
            y={61}
            style={{fill: segs[activeIndex].color}}
          >
            {"" + percentValues[activeIndex] + "%"}
          </text>
        )}*/}

        {/* labels for each arc, rendered AFTER the angles */}
        {segs.map((segment, i) => {
          const degreesMiddle = angles[i].startAngle + (angles[i].endAngle - angles[i].startAngle) / 2
          const labelPos = this.polarToCartesian(50, 50, 50 - this.props.stroke / 2, degreesMiddle)
          let labelRotation = degreesMiddle < 180 ? degreesMiddle - 90 : degreesMiddle + 90
          return (
            <text
              key={i}
              className={cx("label", {
                active: i === activeIndex
              })}
              onClick={() => this.props.onClick(i)}
              x={labelPos.x}
              y={labelPos.y}
              style={{textAnchor: 'middle', alignmentBaseline: 'central'}}
              transform={"rotate(" + (labelRotation) + " " + labelPos.x + "," + labelPos.y + ")"}
            >
              {segment.label}
            </text>
          )
        })}

      </svg>
    )
  }

}
