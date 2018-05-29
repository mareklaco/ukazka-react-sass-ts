import * as React from "react";
import {connect} from "react-redux";
import {IBrand, IState} from "./interfaces";
import {mostUsedBrandsSelector, searchBrandsResultsSelector, specialBrandsSelector} from "./selectors";
import {PageSection} from "../Page/PageSection";
import {PageRow} from "../Page/PageRow";
import {BEER_IMG_URL} from "./constants";

interface IBLCProps {
  onChange:(brandId:number) => void
}

interface IBLSettings {
  firstBrandBigger?:boolean
  pageSectionNoTopMargin?:boolean
}

const makeBrandsListComponent = (title:string | null,
                                 brandsSelector:Function,
                                 settings?:IBLSettings):React.ComponentClass<IBLCProps> => {
  const mapStateToProps = (state:IState) => {
    return {
      brands: brandsSelector(state)
    }
  }
  const BrandsListComponent = (props:IProps) => (
    <BrandsList
      title={title}
      brands={props.brands}
      onChange={props.onChange}
      settings={settings}
    />
  )
  return connect(mapStateToProps)(BrandsListComponent as any) as any
}

interface IProps {
  title:string
  brands?:IBrand[]
  onChange:(brandId:number) => void
  className?:string
  firstBrandBigger?:boolean
  settings?:IBLSettings
}

/**
 * Zoznam dodanych brandov, po kliknuti zavola onChange callback
 */
export class BrandsList extends React.Component<IProps> {

  static defaultProps = {
    settings: {}
  }

  render() {
    const s = this.props.settings
    return (
      <PageSection
        title={this.props.title}
        noTopMargin={s.pageSectionNoTopMargin}
        noContentPadding={true}
      >
        {this.props.brands.map((b, index) => (
          <PageRow
            key={b.id}
            title={b.name}
            onClick={() => this.props.onChange(b.id)}
            checkOnClick={true}
            bold={(index == 0 && s.firstBrandBigger)}
            imgSrc={BEER_IMG_URL}
          />
        ))}
        {/*{this.props.brands.map((b, index) => (
          <Brand
            key={b.id}
            brand={b}
            onClick={this.props.onChange}
            className={(index == 0 && s.firstBrandBigger) ? biggerBrandClass : null}
          />
        ))}*/}
      </PageSection>
    )
  }
}

export const MostUsedBrands = makeBrandsListComponent(
  "Najčastejšie značky",
  mostUsedBrandsSelector,
)
export const SpecialBrands = makeBrandsListComponent(
  "Špeciálne značky",
  specialBrandsSelector,
)

export const SearchResultsBrands = makeBrandsListComponent(
  null,
  searchBrandsResultsSelector,
  {
    firstBrandBigger: true,
    pageSectionNoTopMargin: true,
  }
)
