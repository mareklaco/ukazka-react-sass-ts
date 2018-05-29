import * as md5 from "md5";
import * as fetch from "isomorphic-fetch";
import * as queryString from 'query-string'
import * as Promise from 'promise-polyfill'
import {devLog} from "../../functions";


/**
 * base64 encode raw md5
 *
 * @param {string} input
 * @param {number} length
 * @returns {string}
 */
export const hash = (input:string, length:number) => {
  return btoa(md5(input || '', {asString: true})).substr(0, length)
}

export const paramsAddHash = (params) => {
  //len nenulove hodnoty, t.j. nie-undefined
  const values = Object.keys(params).map(key => params[key]).filter(val => val !== undefined)
  // console.log('Api.paramsAddHash: keys', Object.keys(params));
  // console.log('Api.paramsAddHash: values', values);
  return {
    ...params,
    h: hash(values.join('-'), 6),
  }
}

/**
 * @link https://github.com/github/fetch
 * @link http://redux.js.org/docs/advanced/ExampleRedditAPI.html
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 * @link https://davidwalsh.name/fetch
 */
export const request = (sourceUrl, params, method:'POST' | 'GET' | 'PUT' | 'DELETE' = 'GET') => {

  devLog('Api.request', params)

  const url = sourceUrl + "?" + queryString.stringify(params)

  const requestParam = new Request(url, {
    method: method,
    credentials: "same-origin", //aby sa posielali kolaciky
  })

  return fetch(requestParam)
    .then(
      responseObj => {
        if (responseObj.ok) {
          return responseObj.json()
        } else {
          throw Error(responseObj.statusText)
        }
      },
      fetchError => {
        throw Error(fetchError)
      })
    .then(
      jsonObj => {
        if (jsonObj.error) {
          throw Error(jsonObj.error)
        } else {
          return jsonObj
        }
      },
      jsonError => {
        throw Error(jsonError)
      }
    )
    .catch(error => {
      return Promise.reject(error.message)
    })

}
