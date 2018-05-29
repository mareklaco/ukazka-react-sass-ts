import * as React from "react";


interface IProps {
  title?:string
  children?:any
}

/**
 * Wrapper pre viacere Panel komponenty
 *
 * Ma titulok, zaoblujluje rohy (nie pri XS)
 */
export class PanelsGroup extends React.Component<IProps> {

  render() {
    // console.log('=== PanelsGroup.render()', this.props);
    return (
      <div className="PanelsGroup">
        {(!!this.props.title) && (
          <div className="title">
            {this.props.title}
          </div>
        )}
        <div className="panels">
          {this.props.children}
        </div>
      </div>
    )
  }

}
