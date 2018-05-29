import * as React from "react";
import {media, style} from "typestyle";
import {mobileHorizAndUpMedia} from "../classes";
import {PAGE_BASE_MARGIN} from "./Page";


const noteClass = style({
    marginTop: 6,
    marginBottom: 6,
    marginLeft: PAGE_BASE_MARGIN,
    marginRight: PAGE_BASE_MARGIN,
    fontSize: 12,
    color: '#8e8e93',
    $debugName: 'noteClass',
  },
  media(mobileHorizAndUpMedia, {
    paddingLeft: PAGE_BASE_MARGIN,
  }),
)

export class PageNote extends React.Component {
  render() {
    return (
      <div className={noteClass}>
        {this.props.children}
      </div>
    )
  }
}
