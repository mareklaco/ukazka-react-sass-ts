import {makeFeed} from "./Feed";
import {makeModules} from "./modules";
import {devLog} from "../../functions";


//kvoli dev je to named function (z nazvu fcie je root prefix)
export function makeFeedModule(prefix:string, moduleState:Function) {
  devLog('makeFeedModule()', prefix);
  const modules = makeModules(prefix, moduleState)
  return {
    reducer: modules.FeedList.reducer,
    //public components
    mainComponent: 'Feed',
    Feed: makeFeed(modules),
  }
}
