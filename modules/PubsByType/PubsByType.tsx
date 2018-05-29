import * as React from "react";
import {connect} from "react-redux";
import {IFilter, IPubsByTypeProps} from "./interfaces";
import {makeModuleApp} from "../../apps";
import {SelectorsType} from "./reducer";
import {ActionsType} from "./actions";
import {makePubsModule} from "../Pubs";
import {ModulesType} from "./modules";
import {Panel, PanelsGroup} from "../../presents";


export const makePubsByType = (selectors:SelectorsType, actions:ActionsType, modules:ModulesType):React.ComponentClass<IPubsByTypeProps> => {

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
   * PubsByType je ajaxovy zoznam typov podnikov na zaklade regu
   */
  @(connect(mapStateToProps) as any)
  class PubsByType extends React.Component<IPubsByTypeProps & IStateProps> {

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

    componentWillReceiveProps(newProps:IPubsByTypeProps & IStateProps) {
      // console.log('~~~ PubsByType.componentWillReceiveProps()', newProps);
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
      // console.log('~~~ PubsByType.render()', this.props);

      return (
        <div className="PubsByType">

          <modules.Api.StatusMessages
            noResults={0 == this.props.filters.length}
            noResultsMsg="Žiadne typy podnikov"
          />

          {this.props.filters.map(filter => (
            <PanelsGroup key={filter.filter}>
              <Panel
                title={filter.title}
                subTitle={(filter.count != undefined) && filter.count.toFixed() + 'x'}
                expanded={!!filter.initialPubsResponse}
                renderBody={() => this.renderPanelBody(filter)}
              />
            </PanelsGroup>
          ))}

        </div>
      )
    }
  }

  return PubsByType
}
