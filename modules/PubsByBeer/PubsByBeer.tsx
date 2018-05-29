import * as React from "react";
import {connect} from "react-redux";
import * as _ from "lodash";
import {color} from "csx";
import * as colors from "../../colors";
import {IBeerBrand, IPubsByBeerProps} from "./interfaces";
import {ISegment, Panel, PanelsGroup, Section, SlideDown, Spacer} from "../../presents";
import {SelectorsType} from "./reducer";
import {ActionsType} from "./actions";
import {makeModuleApp} from "../../apps";
import {makePubsModule} from "../Pubs";
import {formatPrice} from "../../functions";
import {ModulesType} from "../PubsByType/modules";
import {SelectSegmentGraph} from "../../statefull";


export const makePubsByBeer = (selectors:SelectorsType, actions:ActionsType, modules:ModulesType):React.ComponentClass<IPubsByBeerProps> => {

  interface IStateProps {
    //connect()
    currentStateRegId?:number
    beerBrands?:IBeerBrand[]
    dispatch?:Function
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      currentStateRegId: selectors.getRegId(state),
      beerBrands: selectors.getBeerBrands(state),
    }
  }


  //Samostatna PubsApp namiesto modulu Pubs, lebo sa X-krat opakuje
  //a to neviem zatial dat do stavu taketo opakovanie.
  //Instancuje sa tu a nie v BeerBrand, aby sa nevykonala hned.
  const PubsApp = makeModuleApp(makePubsModule, 'Pubs')


  interface IState {
    selectedGraphSegmentIndex:number
  }


  /**
   * PubsByBeer je zoznam znaciek piv na zaklade regu
   */
  @(connect(mapStateToProps) as any)
  class PubsByBeer extends React.Component<IPubsByBeerProps & IStateProps, IState> {

    graphSegments:ISegment[] = []
    graphSegmentsBrandIds:number[] = [] //pole brand ids pre dane segmenty
    minPriceBrands:IBeerBrand[]
    maxPriceBrands:IBeerBrand[]

    state:IState = {
      selectedGraphSegmentIndex: null
    }


    selectGraphSegment = (index:number) => {
      this.setState({
        selectedGraphSegmentIndex: index
      })
    }

    componentWillMount() {
      // console.log('~~~ PubsByBeer.componentWillMount()', this.props);
      this.props.dispatch(actions.setRegIdAction(this.props.regId))
      this.props.dispatch(actions.requestFiltersAction())
    }

    componentWillUnmount() {
      // console.log('~~~ PubsByBeer.componentWillUnmount()', this.props);
      //vycstit stav, aby pri opetovom mountovani neboli v stave filtre a zaroven stav loading, co zle vyzera
      this.props.dispatch(actions.resetStateAction())
    }

    componentWillReceiveProps(newProps:IPubsByBeerProps & IStateProps) {
      // console.log('~~~ PubsByBeer.componentWillReceiveProps()', newProps);
      if (newProps.regId != newProps.currentStateRegId) {
        this.props.dispatch(actions.setRegIdAction(newProps.regId))
      }
      if (newProps.beerBrands !== this.props.beerBrands) {
        this.calculateInternalsFromBeerBrands(newProps.beerBrands)
      }
    }

    calculateInternalsFromBeerBrands(beerBrands:IBeerBrand[]) {

      //vypocet najlacnejsieho a najdrahsieho piva
      //vysledkom je pole znaciek (nie podnikov)
      //https://stackoverflow.com/questions/12957405/math-max-and-math-min-nan-on-undefined-entry
      let minPrice = Infinity
      let maxPrice = -Infinity
      beerBrands.forEach(beerBrand => {
        if (beerBrand.minPrice) { //nie null
          minPrice = Math.min(minPrice, beerBrand.minPrice)
        }
        if (beerBrand.maxPrice) { //nie null
          maxPrice = Math.max(maxPrice, beerBrand.maxPrice)
        }
      })

      this.minPriceBrands = null
      this.maxPriceBrands = null
      if ((beerBrands.length > 1) && minPrice != maxPrice) {
        if (minPrice != Infinity) {
          this.minPriceBrands = beerBrands.filter(b => b.minPrice == minPrice)
        }
        if (maxPrice != -Infinity) {
          this.maxPriceBrands = beerBrands.filter(b => b.maxPrice == maxPrice)
        }
      }


      //zostrojit graphBrands
      this.graphSegments = []
      this.graphSegmentsBrandIds = []
      const maxGraphBrands = 5
      const sortedBrands = _.sortBy(beerBrands, 'pubsCount')
      for (let i = 0; i < maxGraphBrands && i < beerBrands.length; i++) {
        const topBrand = sortedBrands.pop()
        this.graphSegments.push({
          label: "" + (i + 1) + ". " + topBrand.shortname || topBrand.name,
          value: topBrand.pubsCount,
          color: color(colors.dark0).lighten(i * 0.09).toString()
        })
        this.graphSegmentsBrandIds.push(topBrand.id)
      }

      /*if (sortedBrands.length > 0) {
        const otherBrandsCount = sortedBrands.reduce((p, c) => p + c.pubsCount, 0)
        this.graphSegments.push({
          id: null,
          label: 'ostatné',
          value: otherBrandsCount
        })
      }*/

    }

    renderPanelBody = (beerBrand:IBeerBrand) => {
      return (
        <PubsApp
          filter="BeerBrand"
          filterParams={{b: beerBrand.id}}
          regId={this.props.regId}
          initialResponse={beerBrand.initialPubsResponse}
        />
      )
    }

    getTitle(beerBrand:IBeerBrand) {
      let result = beerBrand.name
      if (beerBrand.pubsCount > 1) {
        result += " - " + beerBrand.pubsCount.toString() + 'x'
      }
      return result
    }

    getSubTitle(beerBrand:IBeerBrand) {
      let result = ''
      if (beerBrand.minPrice && beerBrand.maxPrice != beerBrand.minPrice) {
        result += formatPrice(beerBrand.minPrice, false) + ' - '
      }
      if (beerBrand.maxPrice) {
        result += formatPrice(beerBrand.maxPrice, true)
      }
      return result
    }

    render() {
      // console.log('~~~ PubsByBeer.render()', this.props);

      const {beerBrands} = this.props

      const selectedBrand = (this.state.selectedGraphSegmentIndex !== null)
        && beerBrands.filter(b => b.id == this.graphSegmentsBrandIds[this.state.selectedGraphSegmentIndex])[0]

      return (
        <div className="PubsByBeer">

          <modules.Api.StatusMessages
            noResults={0 == beerBrands.length}
            noResultsMsg="Žiadne pivá"
          />

          {(this.graphSegments.length > 1) && (
            <Section title="Prevládajúce pivá" className="prevladajucePiva">
              <SelectSegmentGraph
                segments={this.graphSegments}
                onSelect={this.selectGraphSegment}
              />

              <SlideDown expanded={!!selectedBrand}>
                <div>
                  <Spacer/>
                  {(!!selectedBrand) && (
                    <PanelsGroup>
                      <Panel
                        className="slectedBrand"
                        title={this.getTitle(selectedBrand)}
                        subTitle={this.getSubTitle(selectedBrand)}
                        togleable={false}
                        expanded={true}
                        renderBody={() => this.renderPanelBody(selectedBrand)}
                        headerBgColor={(this.state.selectedGraphSegmentIndex !== null) && this.graphSegments[this.state.selectedGraphSegmentIndex].color}
                      />
                    </PanelsGroup>
                  )}
                </div>
              </SlideDown>

            </Section>
          )}

          {/* title="Pivá od najmenej zastúpených" */}
          {(beerBrands.length > 0) && (
            <PanelsGroup
              title="Abecedný zoznam pív"
            >
              {beerBrands.map(beerBrand => (
                <Panel
                  key={beerBrand.id}
                  title={this.getTitle(beerBrand)}
                  subTitle={this.getSubTitle(beerBrand)}
                  expanded={!!beerBrand.initialPubsResponse}
                  renderBody={() => this.renderPanelBody(beerBrand)}
                />
              ))}
            </PanelsGroup>
          )}

          {(this.minPriceBrands) && (
            <PanelsGroup
              title="Najlacnejšie pivo"
            >
              {this.minPriceBrands.map(beerBrand => (
                <Panel
                  key={beerBrand.id}
                  title={beerBrand.name}
                  subTitle={formatPrice(beerBrand.minPrice)}
                />
              ))}
            </PanelsGroup>
          )}

          {(this.maxPriceBrands) && (
            <PanelsGroup
              title="Najdrahšie pivo"
            >
              {this.maxPriceBrands.map(beerBrand => (
                <Panel
                  key={beerBrand.id}
                  title={beerBrand.name}
                  subTitle={formatPrice(beerBrand.maxPrice)}
                />
              ))}
            </PanelsGroup>
          )}

        </div>
      )
    }
  }

  return PubsByBeer
}
