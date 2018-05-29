export const BEER_IMG_URL = "/imgs/beerGlass1.svg"

export const MOST_USED_BRANDS_TRESHOLD = 1500
export const MAX_SEARCH_RESULTS_BRANDS_COUNT = 15
export const MIN_SEARCH_QUERY_CHARS = 1

/**
 * Id piv vylistovanych pod "Specialne piva"
 */
export const SPECIAL_BRANDS_IDS:number[] = [
  68, //vlastné pivo
  //todo: rotujuca pipa
  //todo: neudane pivo?
]

export enum PAGE {
  TapsPage = "/",
  DeleteTapsPage = "/delete",
  AddTapPage = "/add",
  //v URL nepotrebujeme ID tapu, ten nam staci mat v stave
  // EditTapPage = "/tap/:tapKey",
  // TypeEditTapPage = "/tap/:tapKey/type",
  // PriceEditTapPage = "/tap/:tapKey/price",
  EditTapPage = "/tap",
  TypeEditTapPage = "/tap/type",
  PriceEditTapPage = "/tap/price",
}

