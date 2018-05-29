import * as React from "react";
import {connect} from "react-redux";
import * as cx from "classnames";
import * as _ from "lodash";
import {style} from "typestyle";
import {color} from "csx";
import * as colors from "../../colors";
import {IPubsProps} from "./interfaces";
import {ActionsType} from "./actions";
import {iosButtonClass, iosGreenButtonClass,} from "../../classes";
import {LoadingDiv} from "../../presents";
import {SelectorsType} from "./reducer";
import {ModulesType} from "./modules";


/**
 * @todo vyuzit novy List komponent na nacitavanie a zobrazovanie
 */
export const makePubs = (selectors:SelectorsType, actions:ActionsType, modules:ModulesType):React.ComponentClass<IPubsProps> => {

  const pubsWrapperClass = style({
    // border: '1px solid brown',
    $debugName: 'pubsWrapper',
  })

  const pubsWrapperHasMorePubsClass = style({
    // border: '1px solid blue',
    $debugName: 'pubsWrapperHasMorePubs',
  })

  const pubsWrapperIsLoadingNewPubsClass = style({
    opacity: 0.5,
    transition: 'opacity 0.2s',
    cursor: 'wait !important',
    $debugName: 'wrapperIsLoadingNewPubs',
    $nest: {
      '*': {
        cursor: 'wait !important',
      }
    }
  })

  const pubWrapperClass = style({
    position: 'relative', //aby showMoreButton bolo absolutne cez tento prvok
    // border: '1px solid blue',
    $debugName: 'pubWrapperClass',
  })

  const pubWrapper2FadedClass = style({
    opacity: 0.1,
    // border: '4px solid orange',
    $debugName: 'pubWrapper2Faded',
  })

  const recentlyLoadedPubAnimationClass = style({
    animation: 'fadeIn 0.350s',
    // border: '1px solid red',
    $debugName: 'recentlyLoadedPubAnimation',
  })

  //tento div je roztiahnuty na celu sirku/vysku pubWrapperClass
  const showMorePubsWrapperClass = style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',

    //preliv od transparentnej po $UI_COLOR_IOS_AREA_BG
    // backgroundImage: 'linear-gradient(to bottom, rgba(239,239,244,0) 0%,rgba(239,239,244,0.75) 10%, rgba(239,239,244,1) 100%);',

    //preliv od transparentnej po bielu
    // backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,0.75) 10%, rgba(255,255,255,1) 100%);',

    $debugName: 'showMorePubsWrapper',
  })

  const showMorePubsButtonClass = style({
    // border: '1px solid red',
    boxShadow: '1px 1px 4px 0px rgba(80,80,80,0.8)',
    userSelect: 'none',
    '-webkit-tap-highlight-color': 'rgba(255, 255, 255, 0)',
    $debugName: 'showMorePubsButton',
    $nest: {
      '&:hover': {
        boxShadow: '1px 1px 4px 0px rgba(70,70,70,0.9)',
        backgroundColor: color(colors.iosGreen).darken(0.06).toString() + ' !important',
      },
      '&:active': {
        boxShadow: '1px 1px 2px -0.5px rgba(70,70,70,0.9)',
        transform: 'translateY(1px)',
        backgroundColor: color(colors.iosGreen).darken(0.06).toString() + ' !important',
      },
    }
  })

  const buttonIsLoadingClass = style({
    opacity: 0.25,
    transition: 'all 0.2s',
    cursor: 'wait !important',
    $debugName: 'buttonIsLoading',
  })


  interface IStateProps {
    currentStateFilter?:string
    isLoadingNewPubs?:boolean
    isLoadingMorePubs?:boolean
    isLoadingTooLong?:boolean
    pubsHtmlChunks?:string[]
    hasMorePubs?:boolean
    prevPubIndex?:number
    isInitialResponse?:boolean
    dispatch?:Function
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      currentStateFilter: selectors.getFilter(state),
      isLoadingNewPubs: selectors.isLoadingNewPubs(state),
      isLoadingMorePubs: selectors.isLoadingMorePubs(state),
      isLoadingTooLong: selectors.isLoadingTooLong(state),
      pubsHtmlChunks: selectors.getPubsHtmlChunks(state),
      hasMorePubs: selectors.hasMorePubs(state),
      prevPubIndex: selectors.getPrevPubIndex(state),
      isInitialResponse: selectors.isInitialResponse(state),
    }
  }


  /**
   * Pubs je ajaxovy zoznam podnikov na zaklade filtra a regu
   */
  @(connect(mapStateToProps) as any)
  class Pubs extends React.Component<IPubsProps & IStateProps> {

    loadMorePubs = () => {
      this.props.dispatch(actions.requestMorePubsAction())
    }

    componentWillMount() {
      // console.log('^^^ Pubs.componentWillMount()', this.props);
      if (!this.props.regId) {
        console.error('Pubs: nedodany regId')
      }
      if (!this.props.filter) {
        console.error('Pubs: nedodany filter')
      }
      this.props.dispatch(actions.loadPropsAction(this.props))
      if (this.props.initialResponse) {
        this.props.dispatch(actions.recieveInitialResponseAction(this.props.initialResponse))
      } else {
        this.props.dispatch(actions.requestNewPubsAction())
      }
    }

    //reakcia na novy filter v props
    componentWillReceiveProps(newProps:IPubsProps & IStateProps) {
      // console.log('^^^ Pubs.componentWillReceiveProps()', newProps);
      if (
        (newProps.filter && (newProps.filter != newProps.currentStateFilter))
        || (newProps.filterParams && (!_.isEqual(newProps.filterParams, this.props.filterParams)))
      ) {
        this.props.dispatch(actions.loadPropsAction(newProps))
        this.props.dispatch(actions.requestNewPubsAction())
      }
    }

    componentWillUnmount() {
      this.props.dispatch(actions.resetStateAction())
    }

    render() {
      // console.log('^^^ Pubs.render()', this.props);
      const lastPubIndex = this.props.pubsHtmlChunks.length - 1
      const isOnlyOnePubShown = this.props.pubsHtmlChunks.length == 1
      return (
        <div className="Pubs">

          <modules.Api.StatusMessages
            isLoadingCondition={this.props.isLoadingNewPubs}
            noResults={0 == this.props.pubsHtmlChunks.length}
            noResultsMsg="Žiadne podniky"
          />

          {(!this.props.isLoadingTooLong || this.props.isLoadingMorePubs) && (
            <div className={cx('pubsWrapper', pubsWrapperClass)}>
              <div className={cx({
                  [pubsWrapperHasMorePubsClass]: this.props.hasMorePubs,
                  [pubsWrapperIsLoadingNewPubsClass]: this.props.isLoadingNewPubs,
                }
              )}>
                {this.props.pubsHtmlChunks.map((html, index) => (
                  <div
                    key={index}
                    className={cx('pubWrapper', pubWrapperClass)}
                  >

                    <div
                      className={cx({
                        [pubWrapper2FadedClass]: this.props.hasMorePubs && (index == lastPubIndex)
                      })}
                    >
                      <div
                        className={cx({
                          [recentlyLoadedPubAnimationClass]: !this.props.isInitialResponse && (index >= this.props.prevPubIndex)
                        })}
                        dangerouslySetInnerHTML={{__html: html}}
                      />
                    </div>

                    {(this.props.hasMorePubs && (index == lastPubIndex)) && (
                      <div className={showMorePubsWrapperClass}>
                        {(!this.props.isLoadingNewPubs && !this.props.isLoadingTooLong) && (
                          <button
                            type="button"
                            className={cx(iosButtonClass, iosGreenButtonClass, showMorePubsButtonClass, {
                              [buttonIsLoadingClass]: this.props.isLoadingMorePubs,
                            })}
                            disabled={this.props.isLoadingMorePubs}
                            onClick={!this.props.isLoadingMorePubs && this.loadMorePubs}
                          >
                            <i className="fa fa-caret-down"/>
                            <span>
                              {(isOnlyOnePubShown)
                                ? 'Zobraz podniky'
                                : 'Zobraz ďalšie'
                              }
                            </span>
                            <i className="fa fa-caret-down"/>
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* pri dalsich pri PRILIS dlhom nacitavani */}
          {(this.props.isLoadingMorePubs && this.props.isLoadingTooLong) && (
            <LoadingDiv/>
          )}

        </div>
      )
    }
  }

  return Pubs
}
