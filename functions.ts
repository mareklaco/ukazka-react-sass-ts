import * as moment from "moment";

declare var process:any

//todo: excldnut ostatne locales
//https://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack/37172595
//https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
//http://momentjs.com/docs/#/i18n/
moment.locale('sk')


/**
 * Deep Copy
 */
export const deepCopy = (obj) => obj && JSON.parse(JSON.stringify(obj))

/**
 * Vrati cislo ako string s desatinnou ciarkou a Euro znakom
 */
export const formatPrice = (price:number, includeEuroSign = true):string => {
  if (price !== 0 && !price) {
    return ''
  }
  const nonBrakeSpace = String.fromCharCode(160)
  return price.toFixed(2).replace('.', ',') + (includeEuroSign ? nonBrakeSpace + '€' : '')
}

export function scrollToTop() {
  window.scrollTo(0, 0)
}

export function scrollToBottom() {
  window.scrollTo(0, window.document.body.scrollHeight)
}

export const devLog = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}

/**
 * Vrati userfriendly datum a cas pricom odstrani aktualny rok a den
 *
 * @param dateTime mysql format
 */
export const formatDateTime = (dateTime:string):string => {
  if (!dateTime) {
    return ''
  }

  let outputFormat


  //aktualny rok aj den
  if (moment().format('YYYY-MM-DD') == moment(dateTime).format('YYYY-MM-DD')) {
    outputFormat = 'HH:mm'
    //aktualny rok
  } else if (moment().format('YYYY') == moment(dateTime).format('YYYY')) {
    outputFormat = 'D.M. HH:mm'
  } else {
    outputFormat = 'D.M.YYYY HH:mm';
  }
  return moment(dateTime).format(outputFormat);
}

/**
 * Vrati vo formate AGE
 *
 * @param dateTime mysql format
 */
export const formatDateTimeAge = (dateTime:string):string => {
  if (!dateTime) {
    return ''
  }
  return moment(dateTime).fromNow();
}
