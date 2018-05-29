import * as React from "react";
import {connect} from "react-redux";
import {style} from "typestyle";
import * as colors from "../colors";
import {IBrand, IState} from "./interfaces";
import {searchBrandsResultsSelector} from "./selectors";
import {hasSearchBrandQuery} from "./reducer";
import {SearchResultsBrands} from "./BrandsList";


export const noResultsClass = style({
  fontSize: 15,
  fontWeight: 600,
  color: colors.iosRed,
  textAlign: 'center',
  marginTop: 14,
  $debugName: 'noResultsClass',
})

interface IProps {
  onChange:(brandId:number) => void
  //connect
  hasSearchBrandQuery?:boolean,
  searchBrandsResults?:IBrand[],
}

const mapStateToProps = (state:IState) => {
  return {
    hasSearchBrandQuery: hasSearchBrandQuery(state),
    searchBrandsResults: searchBrandsResultsSelector(state),
  }
}

@(connect(mapStateToProps) as any)
export class SearchBrandResults extends React.Component<IProps> {

  render() {

    if (!this.props.hasSearchBrandQuery) {
      return null
    }

    if (0 == this.props.searchBrandsResults.length) {
      return (
        <div className={noResultsClass}>
          Neznáme pivo, skús iný názov...<br/>
          Alebo vyber špeciálny prípad dolu.
        </div>
      )
    }

    return (
      <SearchResultsBrands onChange={this.props.onChange}/>
    )

  }

}
