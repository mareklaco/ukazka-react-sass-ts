import {IBrand, IRichTap} from "./interfaces";
import {MOST_USED_BRANDS_TRESHOLD, SPECIAL_BRANDS_IDS} from "./constants";


/**
 * @deprecated asi pouzit vyssiu funkciu formatPrice co vracia aj euro string
 */
export const formatPrice = (price:number) => {
  if (price !== 0 && !price) {
    return ''
  }
  return price.toFixed(2).replace('.', ',')
}

/**
 * Porovna dva IBrand podla nazvu
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
 */
export const brandsByNameSorter = (b1:IBrand, b2:IBrand) => {
  return b1.name.localeCompare(b2.name, "sk", {sensitivity: 'accent'})
}

/**
 * Porovna dva IBrand podla poctu pouziti
 */
export const brandsMostUsedSorter = (b1:IBrand, b2:IBrand) => {
  if (b1.usageCount < b2.usageCount) {
    return 1
  }
  if (b1.usageCount > b2.usageCount) {
    return -1
  }
  return 0
}

/**
 * Ci je pivo vylistovane pod "Specialne piva"
 *
 * t.j. specialne pripady piva, t.j. "vlastne pivo", "rotujuca pipa", "neudane pivo"
 */
export const isSpecialBrandFilter = (b:IBrand):boolean => {
  //return SPECIAL_BRANDS_IDS.contains(b.id) //todo: ako rozbehat array.contains()?
  return SPECIAL_BRANDS_IDS.indexOf(b.id) !== -1
}

/**
 * Ci je pivo vylistovane pod "Casto pouzivane piva"
 */
export const isMostUsedBrandFilter = (b:IBrand):boolean => {
  return b.usageCount > MOST_USED_BRANDS_TRESHOLD
}


export const richTapToString = (tap:IRichTap):string => {
  if (!tap || !tap.brand) {
    return 'n/a'
  }
  let result = tap.brand.name
  if (tap.oldTypeId) {
    result += ' ' + tap.oldType.replace(/ st$/, '°')
  }
  return result
}

//v URL nepotrebujeme ID tapu, ten nam staci mat v stave
// export const tapPage = (page:PAGE, tap:ITap) => {
//   return page.replace('/:tapKey', "/" + tap.key.toString())
// }
