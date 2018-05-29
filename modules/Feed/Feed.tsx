import * as React from "react";
import {IFeedProps} from "./interfaces";
import {ModulesType} from "./modules";
import {Item} from "./Item";


/**
 *
 */
export const makeFeed = (modules:ModulesType):React.ComponentClass<IFeedProps> => {

  /**
   * Feed je ajaxovy zoznam podnikov na zaklade filtra a regu
   */
  class Feed extends React.Component<IFeedProps> {

    componentWillMount() {
      // console.log('^^^ Feed.componentWillMount()', this.props);
      if (!this.props.regId) {
        console.error('Feed: nedodany regId')
      }
    }

    render() {
      // console.log('^^^ Feed.render()', this.props);
      return (
        <div className="Feed">
          <modules.FeedList.List
            itemComponent={Item}
            {...this.props}
          />
        </div>
      )
    }
  }

  return Feed
}
