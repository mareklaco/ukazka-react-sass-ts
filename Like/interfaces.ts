import {IAvatarUser} from "../User";

/**
 * Spolocny zaklad pre ILikeButtonState aj ILikeButtonProps
 */
interface ILikeButtonInternals {
  /**
   * null pri nezalogovanom
   */
  hasMyLike:boolean | null
  gotMyLike:boolean
  likesCount:number
  likedUsers:IAvatarUser[]
}


/**
 * pre jeden key v likeButtonsStore
 */
export interface ILikeButtonState extends ILikeButtonInternals {
  isLoadingTooLong?:boolean
  isLoadingError?:boolean
}

export interface ILikeButtonsCore {
  pendingRequestObjType:number
  pendingRequestRefId:number
  byKey:{
    [key:string]:ILikeButtonState
  }
}

/**
 * pre react stav LikeButton
 */
export interface ILikeButtonComponentState extends ILikeButtonInternals {
  showLoginWarning:boolean
  isLoadingTooLong?:boolean
  isLoadingError?:boolean
}

export interface ILikeButtonProps extends ILikeButtonInternals {
  objType:number
  refId:number
  /**
   * Autor objektu, ak je znamy.
   *
   * Pre zamedzenie lajkovania vlastnych objektov.
   */
  objAuthorId?:number
}
