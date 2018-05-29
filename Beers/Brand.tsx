import * as React from "react";
import * as cx from "classnames";
import {style} from "typestyle";
import {color} from "csx";
import * as colors from "../colors";
import {shadowBoxStyle} from "../classes";
import {IBrand} from "./interfaces";
import {BEER_IMG_URL} from "./constants";
import {NestedCSSProperties} from "typestyle/lib/types";


// const debugBorder = true
const debugBorder = false

const makeBrandStyle = (bgColor:string):NestedCSSProperties => ({
  ...shadowBoxStyle,
  display: 'flex',
  userSelect: 'none',
  border: debugBorder && '1px solid blue',
  backgroundColor: color(bgColor).toString(),
  boxShadow: '1px 1px 1px 0px rgba(171,171,171,0.8)',
  color: colors.dark2,
  padding: '6px 8px',
  margin: '8px 0',
  cursor: 'pointer',
  $debugName: 'brandClass',
  $nest: {
    '&:active': {
      backgroundColor: color(bgColor).darken(0.05).toString(),
      boxShadow: '1px 1px 0px 0px rgba(150,150,150,0.8)',
      transform: 'translateY(1px)',
    },
  }
})


/**
 * Menej vyrazna farba brandu
 */
export const SecondaryBrandClass = style(
  makeBrandStyle(colors.neutr1),
  {
    color: colors.neutr2,
    opacity: 0.7,
    $debugName: 'brandSecondaryClass',
    $nest: {
      '& img': {
        filter: 'grayscale(100%) brightness(120%)',
      },
      '&:hover': {
        opacity: 0.7,
        backgroundColor: color(colors.neutr1).darken(0.05).toString(),
      },
      '&:active': {
        opacity: 0.7,
      },
    }
  }
)


const brandClass = style(
  makeBrandStyle(colors.basic1)
)

export const biggerBrandClass = style(
  makeBrandStyle(colors.basic1),
  {
    $debugName: 'biggerBrandClass',
    $nest: {
      //name
      ['& > div']: {
        fontWeight: 600,
      }
    }
  }
)

const imgClass = style({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  marginRight: 8,
    border: debugBorder && '1px solid orange',
  $nest: {
    img: {
      width: 20,
    }
  }
  },
)

const nameClass = style(
  {
    flex: 99,
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'center',
    fontSize: 18,
    border: debugBorder && '1px solid cyan',
    $debugName: 'nameClass',
  }
)

interface IProps {
  brand:IBrand
  onClick:(brandId:number) => void,
  className?:string
}

/**
 * Box zobrazi nazov znacky piva a sluzi na vyber (klikntie nan): zavola sa callback s id brandu
 */
export class Brand extends React.Component<IProps> {

  handleClick = (e) => {
    this.props.onClick(this.props.brand.id)
  }

  render() {
    return (
      <div className={cx(this.props.className || brandClass)} onClick={this.handleClick}>
        <div className={imgClass}>
          <img src={BEER_IMG_URL}/>
        </div>
        <div className={nameClass}>
          {this.props.brand.name}
        </div>
      </div>
    )
  }
}
