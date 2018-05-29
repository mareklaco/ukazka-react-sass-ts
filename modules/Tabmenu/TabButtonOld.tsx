import * as React from "react";
import * as cx from "classnames";
import {iosBlueButtonClass, iosButtonClass} from "../../classes";
import {ITabmenuTab,} from "./interfaces";
import {connect} from "react-redux";
import {SelectorsType} from "./reducer";
import {
  buttonClass, buttonSecondaryClass, isActiveButtonClass, isDisabledButtonClass,
  notActiveButtonClass
} from "./classes";
import {ActionsType} from "./actions";


interface IProps {
  tab:ITabmenuTab
  disabled?:boolean
  secondary?:boolean
}

interface IStateProps {
  currentTab?:ITabmenuTab
  dispatch?:Function
}

export const makeTabButtonOld = (selectors:SelectorsType, actions:ActionsType) => {

  const mapStateToProps = (state):IStateProps => {
    return {
      currentTab: selectors.getCurrentTab(state),
    }
  }

  /**
   * Button co pozna zo stavu ci je aktivny a vie sa kliknut
   */
  @(connect(mapStateToProps) as any)
  class TabButtonOld extends React.Component<IProps & IStateProps> {

    onClick = () => {
      this.props.dispatch(actions.setTabAction(this.props.tab))
    }

    render() {
      // console.log('@@@ TabButton.render()', this.props);

      const isActive = (this.props.currentTab === this.props.tab) && !this.props.disabled

      return (
        <button
          type="button"
          style={{margin: 2}}
          className={cx(iosButtonClass, buttonClass, {
              [buttonSecondaryClass]: this.props.secondary,
              [iosBlueButtonClass]: isActive,
              [isActiveButtonClass]: isActive,
              [notActiveButtonClass]: !isActive,
              [isDisabledButtonClass]: this.props.disabled,
            }
          )}
          onClick={!isActive && !this.props.disabled && this.onClick}
        >
          {/*<i className="fa fa-filter"/>*/}
          <span>
          {this.props.tab.title}
        </span>
        </button>
      )
    }
  }

  return TabButtonOld
}
