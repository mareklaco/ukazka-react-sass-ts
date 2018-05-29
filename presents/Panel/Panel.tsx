import * as React from "react";
import * as cx from "classnames";
import {SlideDown} from "../SlideDown";


interface IProps {
  className?:string
  title:string
  subTitle?:string
  /**
   * Ci sa ma dat uzivatelsky klikom otvorit/zatvorit, default true
   */
  togleable?:boolean
  /**
   * defaultny stav expandnutia
   */
  expanded?:boolean
  /**
   * Ak nedodana, tak panel sa nebude dat expandovat (len header)
   */
  renderBody?:Function
  /**
   * Custom farba expandnuteho headeru
   */
  headerBgColor?:string
}

interface IState {
  isExpanded:boolean
}

/**
 * Prezentation component: expandable panel
 */
export class Panel extends React.Component<IProps, IState> {

  static defaultProps = {
    togleable: true
  }

  state = {
    isExpanded: false
  }

  toggleExpand = () => {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  componentWillMount() {
    if (this.props.expanded) {
      this.setState({
        isExpanded: true
      })
    }
  }

  render() {
    // console.log('### Panel.render()', this.props);

    const isTogleable = this.props.togleable && !!this.props.renderBody

    return (
      <div
        className={cx("Panel", this.props.className, {
          expanded: this.state.isExpanded
        })}
        style={{
          borderTopColor: this.state.isExpanded && this.props.headerBgColor,
        }}
      >

        <h2
          className={cx("header", {
            expanded: this.state.isExpanded,
            togleable: isTogleable,
          })}
          style={{
            backgroundColor: this.state.isExpanded && this.props.headerBgColor,
          }}
          onClick={isTogleable && this.toggleExpand}
        >
          <span className="title">
            {this.props.title}
          </span>
          <span className="subTitle">
            {this.props.subTitle}
          </span>
          {isTogleable && (
            <span className="controlls">
            {(this.state.isExpanded)
              ? (
                <i className="fa fa-angle-up"/>
              ) : (
                <i className="fa fa-angle-down"/>
              )}
            </span>
          )}
        </h2>

        {(!!this.props.renderBody) && (
          <SlideDown expanded={this.state.isExpanded}>
            <div className="body">
              {this.props.renderBody()}
            </div>
          </SlideDown>
        )}

      </div>
    )
  }

}
