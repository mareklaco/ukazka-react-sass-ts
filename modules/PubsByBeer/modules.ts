import {makeApiModule} from "../Api";


export const makeModules = (prefix:string, moduleState:Function) => {
  return {
    Api: makeApiModule(prefix + '/Api', (state) => moduleState(state).Api)
  }
}

//https://stackoverflow.com/questions/40590034/typescript-typeof-function-return-value
let m = true ? undefined : makeModules(null, null)
export type ModulesType = typeof m
