import * as React from "react";
import * as cx from "classnames";
import {Bar, ISegment, Pie} from "../presents/SegmentGraph";
import {xsBodyHOC} from "../helpers";


interface IProps {
  segments:ISegment[]
  onSelect:(index:number) => void
  //xsBodyHOC
  xsBody?:boolean
}

interface IState {
  activeSegmentIndex:number
}

/**
 * Responsivo zobrazi Pie alebo Bar graf (podla XS)
 *
 * Oznacit sa da 1 segment
 */
@(xsBodyHOC as any)
export class SelectSegmentGraph extends React.Component<IProps, IState> {

  state:IState = {
    activeSegmentIndex: null,
  }

  toggleActiveSegment = (index:number) => {
    const newActiveSegmentIndex = this.state.activeSegmentIndex === index ? null : index
    this.setState({
      activeSegmentIndex: newActiveSegmentIndex
    })
    this.props.onSelect(newActiveSegmentIndex)
  }

  render() {
    // console.log('~~~ SelectSegmentGraph.render()', this.props);

    // optim: skip jeden render - ked nie je este xsBody hore setnute
    if (this.props.xsBody === null) {
      return null
    }

    return (
      <div className={cx("SelectSegmentGraph", {
        active: this.state.activeSegmentIndex != null
      })}>
        {(this.props.xsBody)
          ? (
            <Pie
              segments={this.props.segments}
              activeIndex={this.state.activeSegmentIndex}
              onClick={this.toggleActiveSegment}
              stroke={32}
            />
          )
          : (
            <Bar
              segments={this.props.segments}
              activeIndex={this.state.activeSegmentIndex}
              onClick={this.toggleActiveSegment}
            />
          )}
      </div>
    )
  }

}
