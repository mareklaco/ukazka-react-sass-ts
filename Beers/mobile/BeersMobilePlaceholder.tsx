import * as React from "react";
import {connect} from "react-redux";
import {style} from "typestyle";
import {IState, ITap} from "../interfaces";
import {iosBlueButtonClass} from "../../classes";
import {Tap, TAP_MARGIN} from "../Tap";
import {Button} from "../Button";


const placeholderClass = style({
  maxWidth: 300,
})

const tapsClass = style({
  backgroundColor: '#fafafa',
  filter: 'brightness(95%) grayscale(25%) blur(0px)',
  // border: '1px solid silver',
  cursor: 'pointer', //aj ked pre mobil to nie je teba
  transform: 'scale(0.75)',
  marginLeft: -35,

  //tieto negativne marginy su nevhodne na test stranke /c.php?hot&mobile#/
  // marginTop: -30,
  // marginBottom: -30,

  //aby sa dorovnali marginy Tap-ov, aby boli jednotne
  paddingTop: TAP_MARGIN / 2,
  paddingBottom: TAP_MARGIN / 2,

  $debugName: 'taps',
})


interface IOwnProps {
  onStart:Function
}

interface IStateProps {
  //connect
  taps?:ITap[]
}

const mapStateToProps = (state:IState):IStateProps => {
  return {
    taps: state.taps,
  }
}

/**
 * Jednoduchy zoznam Tap-ov, urceny na zobrazenie vo formulari PRE MOBIL, este mimo fullscreen rezimu
 */
@(connect(mapStateToProps) as any)
export class BeersMobilePlaceholder extends React.Component<IOwnProps & IStateProps> {
  render() {
    return (
      <div className={placeholderClass}>

        {(this.props.taps.length > 0) && (
          <div
            className={tapsClass}
            onClick={this.props.onStart as any}
          >
            {this.props.taps.map(tap => (
              <Tap
                key={tap.key}
                tap={tap}
              />
            ))}
          </div>
        )}

        <Button
          className={iosBlueButtonClass}
          onClick={this.props.onStart as any}
        >
          <i className="fa fa-expand"/>
          <span>
            Otvor ponuku pív
          </span>
        </Button>

      </div>
    )
  }
}
