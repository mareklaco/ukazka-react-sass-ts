import * as React from "react";
import {connect} from "react-redux";
import {IRegTabsProps, IRegTabsTab} from "./interfaces";
import {Custom1} from "./Custom1";
import {ModulesType} from "./modules";
import {makeModuleApp} from "../../apps"
import {makePubsByTypeModule} from "../PubsByType";
import {KeepHeight} from "../../presents";
import {makePubsByBeerModule} from "../PubsByBeer";
import {makePubsByPriceModule} from "../PubsByPrice";
import {PanelsGroup} from "../../presents/Panel";
import {makeFeedModule} from "../Feed";


export const makeRegTab = (modules:ModulesType):React.ComponentClass<IRegTabsProps> => {

  interface IStateProps {
    currentTab?:IRegTabsTab
    tabWasEverChanged?:boolean
    isFewPubs?:boolean
    dispatch?:Function
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      currentTab: modules.Tabmenu.getCurrentTab(state),
      tabWasEverChanged: modules.Tabmenu.tabWasEverChanged(state),
      isFewPubs: modules.Pubs.isFewPubs(state),
    }
  }


  /**
   * Tabs su zalozky a ajaxove zoznamy podnikov na zaklade tabov a regu
   */
  @(connect(mapStateToProps) as any)
  class RegTabs extends React.Component<IRegTabsProps & IStateProps> {

    //PubsByTypeApp by sa dal prerobit ako modul celej aplikacie modules.PubsByType
    //a jeho stav by bol integrovany do stavu RegTabsApp,
    //ale zas potom by sa instanciovalo PubsByType a PubsByType/Api aj ked to nie je potrebne
    PubsByTypeApp
    PubsByBeerApp
    PubsByPriceApp
    FeedApp

    componentWillMount() {
      // console.log('*** RegTabs.componentWillMount()', this.props);
      //prvotne nastavenie toolbar.currentTab
      if (this.props.tabs.length > 0) {
        const firstTab = this.props.tabs[0]
        this.props.dispatch(modules.Tabmenu.setTabAction(firstTab))
      }
      if (!this.props.regId) {
        console.error('RegTabs: nedodany regId')
      }
    }

    renderComponent(component:string) {

      //kopia dole
      //initialResponse budeme dodavat ak nikdy neprislo este k (uzivatelskemu) zmene Tabu,
      //lebo po klikoch na taby uz mame uzus, ze sa nacitavaju cerstve data a s vacsim limitom
      const initialResponse = (!this.props.tabWasEverChanged) && this.props.initialResponse

      switch (component) {
        case 'PubsByType':
          if (!this.PubsByTypeApp) {
            this.PubsByTypeApp = makeModuleApp(makePubsByTypeModule, 'PubsByType')
          }
          return <this.PubsByTypeApp regId={this.props.regId}/>
        case 'PubsByBeer':
          if (!this.PubsByBeerApp) {
            this.PubsByBeerApp = makeModuleApp(makePubsByBeerModule, 'PubsByBeer')
          }
          return <this.PubsByBeerApp regId={this.props.regId}/>
        case 'PubsByPrice':
          if (!this.PubsByPriceApp) {
            this.PubsByPriceApp = makeModuleApp(makePubsByPriceModule, 'PubsByPrice')
          }
          return <this.PubsByPriceApp regId={this.props.regId}/>
        case 'Feed':
          if (!this.FeedApp) {
            this.FeedApp = makeModuleApp(makeFeedModule, 'Feed')
          }
          return <this.FeedApp
            regId={this.props.regId}
            limit={this.props.limit}
            initialResponse={initialResponse}
          />
        case 'custom1':
          return <Custom1/>
      }
      return (
        <div>
          unknown component: {component}
        </div>
      )
    }

    render() {
      // console.log('*** RegTabs.render()', this.props);

      const {currentTab} = this.props

      const actualFilter = currentTab && currentTab.filter
      const actualComponent = currentTab && currentTab.component
      const actualDescription = currentTab && currentTab.description

      //kopia hore
      //initialResponse budeme dodavat ak nikdy neprislo este k (uzivatelskemu) zmene Tabu,
      //lebo po klikoch na taby uz mame uzus, ze sa nacitavaju cerstve data a s vacsim limitom
      const initialResponse = (!this.props.tabWasEverChanged) && this.props.initialResponse

      //todo: toto zle funguje (preblikava) ak su len 3 podniky vo vysledku (po seedovani)
      //toolbar je disablovany ak zobrazujeme podniky a mame prilis malo podnikov (pri neobmedzenom filtri)
      const disabledToolbar = !!actualFilter && this.props.isFewPubs

      // console.log('*** RegTabs.render() actualFilter', actualFilter);
      // console.log('*** RegTabs.render() initialResponse', initialResponse);

      return (
        <div className="RegTabs">
          <KeepHeight>

            <modules.Tabmenu.Tabmenu
              tabs={this.props.tabs}
              disabled={disabledToolbar}
            />

            {(!!actualDescription) && (
              <PanelsGroup title={actualDescription}/>
            )}

            {(!!actualComponent) && (
              this.renderComponent(actualComponent)
            )}

            {(!!actualFilter) && (
              <modules.Pubs.Pubs
                filter={actualFilter}
                regId={this.props.regId}
                limit={this.props.limit}
                initialResponse={initialResponse}
              />
            )}

          </KeepHeight>
        </div>
      )
    }
  }

  return RegTabs
}
