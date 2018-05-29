import * as React from "react";
import {connect} from "react-redux";
import {IFilter, IPubsByPriceProps} from "./interfaces";
import {makeModuleApp} from "../../apps";
import {SelectorsType} from "./reducer";
import {ActionsType} from "./actions";
import {makePubsModule} from "../Pubs";
import {ModulesType} from "./modules";
import {Panel, PanelsGroup} from "../../presents";


export const makePubsByPrice = (selectors:SelectorsType, actions:ActionsType, modules:ModulesType):React.ComponentClass<IPubsByPriceProps> => {

  interface IStateProps {
    //connect()
    currentStateRegId?:number
    filters?:IFilter[]
    dispatch?:Function
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      currentStateRegId: selectors.getRegId(state),
      filters: selectors.getFilters(state),
    }
  }


  //samostatna PubsApp namiesto modulu Pubs, lebo sa X-krat opakuje
  //a to neviem zatial dat do stavu taketo opakovanie
  const PubsApp = makeModuleApp(makePubsModule, 'Pubs')


  /**
   * Zoznam najlacnejsich a najdrajsich podnikov (t.j. piv na zaklade) regu
   *
   * btw. kod je rovnaky ako PubsByType, len sa pouzije ine API.
   */
  @(connect(mapStateToProps) as any)
  class PubsByPrice extends React.Component<IPubsByPriceProps & IStateProps> {

    componentWillMount() {
      // console.log('~~~ PubsByType.componentWillMount()', this.props);
      this.props.dispatch(actions.setRegIdAction(this.props.regId))
      this.props.dispatch(actions.requestFiltersAction())
    }

    componentWillUnmount() {
      // console.log('~~~ PubsByType.componentWillUnmount()', this.props);
      //vycstit stav, aby pri opetovom mountovani neboli v stave filtre a zaroven stav loading, co zle vyzera
      this.props.dispatch(actions.resetStateAction())
    }

    componentWillReceiveProps(newProps:IPubsByPriceProps & IStateProps) {
      // console.log('~~~ PubsByPrice.componentWillReceiveProps()', newProps);
      if (newProps.regId != newProps.currentStateRegId) {
        this.props.dispatch(actions.setRegIdAction(newProps.regId))
      }
    }

    renderPanelBody = (filter:IFilter) => {
      return (
        <PubsApp
          filter={filter.filter}
          regId={this.props.regId}
          initialResponse={filter.initialPubsResponse}
        />
      )
    }

    render() {
      // console.log('~~~ PubsByPrice.render()', this.props);

      return (
        <div className="PubsByPrice">

          <modules.Api.StatusMessages
            noResults={0 == this.props.filters.length}
            noResultsMsg="Žiadne ceny"
          />

          {this.props.filters.map(filter => (
            <PanelsGroup key={filter.filter}>
              <Panel
                title={filter.title}
                expanded={true}
                renderBody={() => this.renderPanelBody(filter)}
              />
            </PanelsGroup>
          ))}

        </div>
      )
    }
  }

  return PubsByPrice
}
