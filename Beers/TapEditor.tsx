import * as React from "react";
import {connect} from "react-redux";
import {IBrandsById, IOldTypesById, IState, IStylesById, ITap} from "./interfaces";
import {updateTapAction} from "./actions";


interface IProps {
  tap:ITap
  onClose:(e?) => any
  //connect
  brandsById?:IBrandsById
  oldTypesById?:IOldTypesById
  oldTypesIds?:number[]
  stylesById?:IStylesById
  dispatch?:Function
}

const mapStateToProps = (state:IState) => {
  return {
    brandsById: state.brandsById,
    oldTypesById: state.oldTypesById,
    oldTypesIds: state.oldTypesIds,
    stylesById: state.stylesById,
  }
}

/**
 * Editovat vlastnosti Tap-u
 */
@(connect(mapStateToProps) as any)
export class TapEditor extends React.Component<IProps> {

  state = {
    submitStarted: false,
  }

  setTapProp = (key:string, value:string | number) => {
    this.props.dispatch(updateTapAction({
        ...this.props.tap,
        [key]: value
      }
    ))
  }

  setBrand = (brandId:number) => {
    this.setTapProp('brandId', brandId)
  }

  setLitres = (litres:number) => {
    this.setTapProp('litres', litres)
  }

  setPrice = (price:number) => {
    this.setTapProp('price', price)
  }

  onChangeOldType = (e) => {
    this.setTapProp('oldTypeId', e.target.value)
  }

  onChangeStyle = (e) => {
    this.setTapProp('styleId', e.target.value)
  }

  startSubmit = () => {
    this.setState({
      submitStarted: true,
    })
  }

  /*renderLitres() {
    return (
      <div>
        {[0.5, 0.4, 0.3, 0.25].map(litre => (
          <div key={litre}>
            <button
              type="button"
              className={cx("buttonLitres", {active: (litre == this.props.tap.litres)})}
              onClick={() => this.setLitres(litre)}
            >
              {litre.toString().replace('.', ',')}l
            </button>
          </div>
        ))}
      </div>
    )
  }*/

  render() {
    return (
      <div>

        {/* oldTypeId */}
        <select value={this.props.tap.oldTypeId || ""} onChange={this.onChangeOldType}>
          {this.props.oldTypesIds.map(id => (
            <option key={id} value={id}>
              {this.props.oldTypesById[id]}
            </option>
          ))}
        </select>

        {/*
        {(!this.props.tap.styleId) && (
          <div>
            Vyber štýl piva:<br/>
            <br/>
             styl piva
            {Object.keys(this.props.stylesById).map(id => (
              <span key={id}>
                <button key={id} type="button" onClick={() => this.setTapProp('styleId', id)}>
                  {this.props.stylesById[id]}
                </button>
                {' '}
              </span>
            ))}

          </div>
        )}
        */}

        {/*
          {(!this.props.tap.degrees) && (
            <div>
              Vyber stupňovitosť piva:<br/>
              <br/>

               stupne piva
              {[12, 11, 10].map(value => (
                <span key={value}>
                  <button key={value} type="button" onClick={() => this.setTapProp('degrees', value)}>
                    {value}&deg;
                  </button>
                  {' '}
                </span>
              ))}

              {' '}
              zadaj:
              <input type="text" size={3}/>

            </div>
          )}
        */}

        {/* OK button */}
        <button type="button" style={{marginLeft: 10}} onClick={this.props.onClose}>
          Ok
        </button>

      </div>
    )
  }

}
