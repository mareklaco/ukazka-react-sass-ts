import * as React from "react";
import {IFeedItem} from "./interfaces";
import {formatDateTime, formatDateTimeAge} from "../../functions";
import {Avatar} from "../../User";
import {LikeButton} from "../../Like";


declare var jQuery:JQueryStatic

interface IProps {
  item:IFeedItem
}

/**
 * Item je jeden item vo Feed-e
 */
export class Item extends React.Component<IProps> {


  /**
   * Vzdy len docitavame dalsie itemy, ale predosle sa nemenia, takze super optimalizacia
   */
  shouldComponentUpdate(nextProps:IProps) {
    return false
  }

  componentDidMount() {
    this.itemRendered()
  }

  componentDidUpdate() {
    this.itemRendered()
  }

  itemRendered() {
    // console.log('^^^ Item.itemRendered() .... ', this.props.item.id, this.props.isRecentlyLoaded);

    window.setTimeout(() => {
      //https://masonry.desandro.com/extras.html#bootstrap
      jQuery(".Item_" + this.props.item.id + ' .pictures').masonry({
        itemSelector: '.picture',
      })
    }, 250) //100 je zda sa naozaj malo aj bez cpu throttling aj s nacitanymi velkostami obrazkov v db

  }

  render() {
    // console.log('### Item.render()', this.props);
    const {item} = this.props
    return (
      <div
        key={item.id}
        className={"Item Item_" + item.id}
      >

        <div
          className="dateTime"
          title={formatDateTime(item.dateTime)}
        >
          {formatDateTimeAge(item.dateTime)}
        </div>

        {(!!item.regs && item.regs.length > 0) && (
          <div className="regs">
            {item.regs.map((r, i) => (
              <span key={i}>
                <a href={r.link}>
                  {r.name}
                </a>
              </span>
            ))}
          </div>
        )}

        <div className="header">
          {(!!item.user)
            ? (
              <Avatar user={item.user} showUserName={true}/>
            )
            : (
              <span className="userName">
                {item.nonRegUserName || 'návštevník'}
              </span>
            )}
          <span className="eventMsg">
            {item.eventMsg}
          </span>
          {item.inRelatedPub && item.relatedPub && (
            <span className="inRelatedPub">
              @
            </span>
          )}
          {item.relatedPub && (
            <a
              className="relatedPub"
              href={item.relatedPub.link}>
              {item.relatedPub.name}
            </a>
          )}
        </div>

        {!!item.html && (
          <div
            className="html"
            dangerouslySetInnerHTML={{__html: item.html}}
          />
        )}

        {(!!item.like) && (
          <div className="likeRow">
            <LikeButton {...item.like} objAuthorId={item.user && item.user.id}/>
          </div>
        )}

      </div>
    )
  }
}
