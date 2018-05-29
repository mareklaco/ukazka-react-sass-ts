import * as React from "react";
import {connect} from "react-redux";
import * as cx from "classnames";
import {style} from "typestyle";
import Transition from 'react-motion-ui-pack';
import {ITabmenuProps} from "./interfaces";
import {iosButtonClass} from "../../classes";
import {buttonClass, isDisabledButtonClass, notActiveButtonClass, toggleButtonClass} from "./classes";
import {ActionsType} from "./actions";
import {SelectorsType} from "./reducer";
import {makeTabButtonOld} from "./TabButtonOld";


export const makeTabmenuOld = (selectors:SelectorsType, actions:ActionsType):React.ComponentClass<ITabmenuProps> => {

  const toolbarClass = style({
    // borderTop: "1px solid " + colors.basic2,
    // borderBottom: "1px solid " + colors.basic2,
    // backgroundColor: '#fafafa',
    // backgroundColor: 'white',
    padding: '8px 4px',
    $debugName: 'toolbar',
    // $nest: {
    //   button: {
    //     margin: 2,
    //   },
    // }
  })

  const disabledToolbarClass = style({
    // filter: 'grayscale(100%);',
    $debugName: 'disabledToolbar',
  })

  const primaryTabsWrapperClass = style({
    // border: "1px solid orange",
    $debugName: 'primaryTabsWrapper',
  })

  const secondaryTabsWrapperClass = style({
    // paddingTop: 3,
    // border: "1px solid red",
    $debugName: 'secondaryTabsWrapper',
  })


  interface IStateProps {
    isExpanded?:boolean
    dispatch?:Function
  }

  const TabButtonOld = makeTabButtonOld(selectors, actions)
  const TabButton = makeTabButtonOld(selectors, actions)

  const mapStateToProps = (state):IStateProps => {
    return {
      isExpanded: selectors.isExpanded(state),
    }
  }

  /**
   * Tabs su zalozky a ajaxove zoznamy podnikov na zaklade tabov a regu
   */
  @(connect(mapStateToProps) as any)
  class TabmenuOld extends React.Component<ITabmenuProps & IStateProps> {

    secondaryTabsEnterStyle = {
      opacity: 1,
      maxHeight: 50,
      translateY: 0,
      marginTop: 3,
    }

    secondaryTabsLeaveStyle = {
      opacity: 0,
      maxHeight: 0,
      translateY: -4,
      marginTop: 0,
    }

    toggleExpand = () => {
      if (this.props.isExpanded) {
        this.props.dispatch(actions.collapseAction())
      } else {
        this.props.dispatch(actions.expandAction())
      }
    }

    componentWillMount() {
      // console.log('@@@ Tabmenu.componentWillMount()', this.props);
      if (!this.props.tabs) {
        console.error('Tabmenu: nedodane tabs')
      }
    }

    render() {
      // console.log('@@@ Tabmenu.render()', this.props);
      if (!this.props.tabs.length) {
        return null;
      }
      const primaryTabs = this.props.tabs.filter((tab, index) => index < 5)
      const secondaryTabs = this.props.tabs.filter((tab, index) => index >= 5)
      return (
        <div className={cx(toolbarClass, {
          [disabledToolbarClass]: this.props.disabled
        })}>

          <div className={primaryTabsWrapperClass}>
            {primaryTabs.map(tab => (
              <TabButtonOld
                key={tab.title}
                tab={tab}
                disabled={this.props.disabled}
              />
            ))}

            {(secondaryTabs.length > 0) && (
              <button
                type="button"
                className={cx(iosButtonClass, buttonClass, notActiveButtonClass, toggleButtonClass, {
                    [isDisabledButtonClass]: this.props.disabled,
                  }
                )}
                onClick={this.toggleExpand}
              >
            <span>
              {this.props.isExpanded ? 'menej' : 'viac'}
            </span>
                <i className={this.props.isExpanded ? 'fa fa-caret-up' : 'fa fa-caret-down'}/>
              </button>
            )}
          </div>

          <Transition
            runOnMount={false}
            enter={this.secondaryTabsEnterStyle}
            leave={this.secondaryTabsLeaveStyle}
          >
            {(secondaryTabs.length > 0 && this.props.isExpanded) && (
              <div key="secondaryTabsWrapper" className={secondaryTabsWrapperClass}>
                {secondaryTabs.map(tab => (
                  <TabButtonOld
                    key={tab.title}
                    tab={tab}
                    disabled={this.props.disabled}
                    secondary={true}
                  />
                ))}
              </div>
            )}
          </Transition>

        </div>
      )
    }
  }

  return TabmenuOld
}
