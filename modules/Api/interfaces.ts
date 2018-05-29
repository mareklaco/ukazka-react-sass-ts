/**
 */
export interface IApiState {
  pendingRequestHash:string
  errorLoadingMsg:string
  isLoading:boolean
  isLoadingTooLong:boolean
  response
}
