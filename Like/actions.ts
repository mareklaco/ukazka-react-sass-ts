export const LIKE_REQUEST = 'LIKE_REQUEST'

const makeRequestParams = (objType:number, refId:number) => {
  return {
    a: 'Like', //api
    t: objType,
    i: refId,
  }
}

/**
 * Like/unlike
 */
export const likeAction = (objType:number, refId:number) => {
  return (apiModule) => {
    return (dispatch) => {
      dispatch({
        type: LIKE_REQUEST,
        objType,
        refId,
      })
      dispatch(
        apiModule.requestAction(makeRequestParams(objType, refId), 'POST') //POST aby sa necachovalo
      )
    }
  }
}
