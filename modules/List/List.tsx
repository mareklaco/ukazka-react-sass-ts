import * as React from "react";
import {connect} from "react-redux";
import * as cx from "classnames";
import {IListProps} from "./interfaces";
import {ActionsType} from "./actions";
import {LoadingDiv} from "../../presents";
import {SelectorsType} from "./reducer";
import {ModulesType} from "./modules";


/**
 */
export const makeList = (selectors:SelectorsType, actions:ActionsType, modules:ModulesType):React.ComponentClass<IListProps> => {

  interface IStateProps {
    isLoadingNew?:boolean
    isLoadingMore?:boolean
    isLoadingTooLong?:boolean
    items?:any[]
    hasMore?:boolean
    prevIndex?:number
    isInitialResponse?:boolean
    dispatch?:Function
  }

  const mapStateToProps = (state):IStateProps => {
    return {
      isLoadingNew: selectors.isLoadingNew(state),
      isLoadingMore: selectors.isLoadingMore(state),
      isLoadingTooLong: selectors.isLoadingTooLong(state),
      items: selectors.getItems(state),
      hasMore: selectors.hasMore(state),
      prevIndex: selectors.getPrevIndex(state),
      isInitialResponse: selectors.isInitialResponse(state),
    }
  }


  /**
   * List je ajaxovy zoznam itemov...
   */
  @(connect(mapStateToProps) as any)
  class List extends React.Component<IListProps & IStateProps> {

    loadMore = () => {
      this.props.dispatch(actions.requestMoreAction())
    }

    componentWillMount() {
      // console.log('^^^ List.componentWillMount()', this.props);
      if (!this.props.regId) {
        console.error('List: nedodany regId')
      }
      this.props.dispatch(actions.loadPropsAction(this.props))
      if (this.props.initialResponse) {
        this.props.dispatch(actions.recieveInitialResponseAction(this.props.initialResponse))
      } else {
        this.props.dispatch(actions.requestNewAction())
      }
    }

    componentWillUnmount() {
      this.props.dispatch(actions.resetStateAction())
    }

    render() {
      // console.log('^^^ List.render()', this.props);
      const lastIndex = this.props.items.length - 1
      const isOnlyOneItemShown = this.props.items.length == 1
      return (
        <div className="List">

          <modules.Api.StatusMessages
            isLoadingCondition={this.props.isLoadingNew}
            noResults={0 == this.props.items.length}
            noResultsMsg="Žiadne dáta"
          />

          {(!this.props.isLoadingTooLong || this.props.isLoadingMore) && (
            <div>
              <div className={cx({
                wrapperIsLoadingNew: this.props.isLoadingNew,
                }
              )}>
                {this.props.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="itemWrapper"
                  >

                    <div
                      className={cx({
                        itemWrapper2Faded: this.props.hasMore && (index == lastIndex)
                      })}
                    >
                      <div
                        className={cx({
                          itemWrapper3recentlyLoadedAni: !this.props.isInitialResponse && (index >= this.props.prevIndex)
                        })}
                      >
                        <this.props.itemComponent item={item}/>
                      </div>
                    </div>

                    {(this.props.hasMore && (index == lastIndex)) && (
                      <div className="showMoreWrapper">
                        {(!this.props.isLoadingNew && !this.props.isLoadingTooLong) && (
                          <button
                            type="button"
                            className={cx('buttonLarge', {
                              buttonIsLoading: this.props.isLoadingMore,
                            })}
                            disabled={false && this.props.isLoadingMore}
                            onClick={!this.props.isLoadingMore && this.loadMore}
                          >
                            <i className="fa fa-caret-down"/>
                            <span>
                              {(isOnlyOneItemShown)
                                ? 'Zobraz'
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
          {(this.props.isLoadingMore && this.props.isLoadingTooLong) && (
            <LoadingDiv/>
          )}

        </div>
      )
    }
  }

  return List
}
