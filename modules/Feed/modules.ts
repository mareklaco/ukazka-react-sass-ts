import {makeListModule} from "../List";


export const makeModules = (prefix:string, moduleState:Function) => {
  return {
    FeedList: makeListModule(prefix + '/List', (state) => moduleState(state), 'Feed'),
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let m = true ? undefined : makeModules(null, null)
export type ModulesType = typeof m
