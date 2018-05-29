import * as types from 'typestyle/lib/types';


/**
 * Spolocne styly pre ErrorDiv, LoadingDiv, NoReultsDiv
 */
export const baseDivStyle:types.NestedCSSProperties = {
  minHeight: 75,
  paddingTop: 20,
  paddingBottom: 10,
  textAlign: 'center',
  fontSize: 48,
  // border: '1px solid green',
  $nest: {
    '& > div': {
      margin: '10px 0',
      fontSize: 16,
    },
    //pre detailed error
    '& > div > div': {
      margin: '5px 0',
      fontSize: 12,
    },
  }
}
