import * as React from "react";
import {media, style} from "typestyle";
import * as colors from "../colors";
import {PAGE_BASE_MARGIN} from "./Page";
import {mobileHorizAndUpMedia, mobileVertMedia} from "../classes";


const sectionClass = style({
  marginTop: PAGE_BASE_MARGIN * 2.5,
  marginBottom: 6, //lebo pod <PageSection> moze nasledovat <PageNote> a medzi nimi chcem len 6px vzajomnu medzeru
  $debugName: 'sectionClass',
})

const sectionTitleClass = style(
  {
    padding: '6px ' + PAGE_BASE_MARGIN + 'px',
    color: '#8e8e93',
    textTransform: 'uppercase',
    fontSize: 13,
    $debugName: 'sectionTitleClass',
  },
  media(mobileHorizAndUpMedia, {
    marginLeft: PAGE_BASE_MARGIN,
  }),
)

const sectionContentClass = style({
    //workaround na zamedzenie "collapsing margins"
    //https://css-tricks.com/what-you-should-know-about-collapsing-margins/
    //https://www.sitepoint.com/collapsing-margins/
    paddingTop: 1,
    backgroundColor: 'white',
    $debugName: 'sectionContentClass',
  },
  media(mobileVertMedia, {
    borderTop: '1px solid ' + colors.iosBorder,
    borderBottom: '1px solid ' + colors.iosBorder,
  }),
  media(mobileHorizAndUpMedia, {
    borderRadius: 4,
    marginRight: PAGE_BASE_MARGIN,
    marginLeft: PAGE_BASE_MARGIN,
  }),
)


const contentPaddingClass = style({
  padding: PAGE_BASE_MARGIN,
  $debugName: 'contentPadding',
})

interface IProps {
  title?:string
  noTopMargin?:boolean
  noContentPadding?:boolean
  style?:any
}

export class PageSection extends React.Component<IProps> {

  static defaultProps = {
    style: {}
  }

  render() {
    const sectionStyle = {...this.props.style}
    if (this.props.noTopMargin) {
      sectionStyle.marginTop = 0
    }
    const contentStyle = this.props.noTopMargin ? {
      borderTop: 'none',
      borderRadius: 0,
    } : {}
    const contentPaddingStyle:any = this.props.noContentPadding ? {
      padding: 0,
    } : {}
    return (
      <div className={sectionClass} style={sectionStyle}>
        {(!!this.props.title) && (
          <div className={sectionTitleClass}>
            {this.props.title}
          </div>
        )}
        <div className={sectionContentClass} style={contentStyle}>
          <div className={contentPaddingClass} style={contentPaddingStyle}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
