import * as React from "react";
import {connect} from "react-redux";
import * as cx from "classnames";
import Transition from 'react-motion-ui-pack';
import {ITabmenuProps, ITabmenuTab} from "./interfaces";
import {ActionsType} from "./actions";
import {SelectorsType} from "./reducer";
import {ITabsTab, Tabs} from "../../presents";


export const makeTabmenu = (selectors:SelectorsType, actions:ActionsType):React.ComponentClass<ITabmenuProps> => {

  interface IStateProps {
    currentTab?:ITabmenuTab
    isExpanded?:boolean
    dispatch?:Function
  }

  // const TabmenuOld = makeTabmenuOld(selectors, actions)

  const mapStateToProps = (state):IStateProps => {
    return {
      currentTab: selectors.getCurrentTab(state),
      isExpanded: selectors.isExpanded(state),
    }
  }

  /**
   * Tabs su zalozky a ajaxove zoznamy podnikov na zaklade tabov a regu
   */
  @(connect(mapStateToProps) as any)
  class Tabmenu extends React.Component<ITabmenuProps & IStateProps> {

    static defaultProps = {
      primaryTabsCount: 4, //spolu so zalozkou "viac..."
    }

    primaryTabs:ITabsTab[]
    secondaryTabs:ITabsTab[]
    firstSecondaryTabIndex:number

    secondaryTabsEnterStyle = {
      opacity: 1,
      maxHeight: 50,
      // maxHeight: spring(50, presets.stiff),
      // translateY: 5, //sposobuje flickerovanie borderu
      // marginTop: 5, //sposobuje flickerovanie borderu
    }

    //todo: toto by sa zislo animovat rezkejsie, ale neviem ako na to
    secondaryTabsLeaveStyle = {
      opacity: 0,
      maxHeight: 0,
      // maxHeight: spring(0, presets.stiff), //toto nefunguje, error NaN
      // translateY: 0,
      // marginTop: 0,
    }

    componentWillMount() {
      // console.log('@@@ Tabmenu.componentWillMount()', this.props);
      if (!this.props.tabs) {
        console.error('Tabmenu: nedodane tabs')
      }
      this.importTabs(this.props.tabs)
    }

    componentWillReceiveProps(newProps) {
      // console.log('@@@ Tabmenu.componentWillReceiveProps()', newProps);
      if (this.props.tabs !== newProps.tabs) {
        this.importTabs(newProps.tabs)
      }
    }

    importTabs(tabs:ITabmenuTab[]) {
      // console.log('@@@ Tabmenu.importTabs()', tabs);

      this.primaryTabs = []
      this.secondaryTabs = []
      this.firstSecondaryTabIndex = null

      this.props.tabs.forEach((tabmenuTab, index) => {
        const tab:ITabsTab = {
          id: index,
          title: tabmenuTab.title,
          xsTitle: tabmenuTab.xsTitle,
        }
        //aby aj s "viac..." zalozkou bol max pocet (resp. aby sekundarych bolo min 2ks)
        const isPrimary = this.props.tabs.length <= this.props.primaryTabsCount
          || (index + 1 < this.props.primaryTabsCount)
        const jar = isPrimary ? this.primaryTabs : this.secondaryTabs
        jar.push(tab)
      })

      if (this.secondaryTabs.length > 0) {
        this.firstSecondaryTabIndex = (this.secondaryTabs[0].id as number)
        this.primaryTabs.push({
          id: 'expand',
          title: 'viac...',
        })
      }
    }

    handlePrimaryClick = (id) => {
      if ('expand' === id) {
        if (this.firstSecondaryTabIndex) {
          this.setTabByIndex(this.firstSecondaryTabIndex)
        }
        this.props.dispatch(actions.expandAction())
      } else {
        this.setTabByIndex(id)
        if (this.props.isExpanded) {
          this.props.dispatch(actions.collapseAction())
        }
      }
    }

    handleSecondaryClick = (id) => {
      this.setTabByIndex(id)
    }

    setTabByIndex = (index) => {
      this.props.dispatch(actions.setTabAction(this.props.tabs[index]))
    }

    render() {
      // console.log('@@@ Tabmenu.render()', this.props);
      if (!this.props.tabs.length) {
        return null;
      }

      let activeTabIndex = null
      this.props.tabs.forEach((tabmenuTab, index) => {
        if (tabmenuTab === this.props.currentTab) {
          activeTabIndex = index
        }
      })

      return (
        <div className={cx("Tabmenu")}>

          <Tabs
            activeId={this.props.disabled ? null : (this.props.isExpanded ? 'expand' : activeTabIndex)}
            onClick={this.handlePrimaryClick}
            tabs={this.primaryTabs}
            disabled={this.props.disabled}
          />

          <Transition
            runOnMount={false}
            enter={this.secondaryTabsEnterStyle}
            leave={this.secondaryTabsLeaveStyle}
          >
            {(this.props.isExpanded) && (
              <div
                key="secondaryTabs"
                className="Tabmenu__secondaryTabs"
              >
                <Tabs
                  activeId={activeTabIndex}
                  onClick={this.handleSecondaryClick}
                  tabs={this.secondaryTabs}
                />
              </div>
            )}
          </Transition>

          {/*<TabmenuOld tabs={this.props.tabs}/>*/}

        </div>
      )
    }
  }

  return Tabmenu
}
