import {combineReducers} from "redux";
import {ModulesType} from "./modules";


export const makeReducer = (modules:ModulesType) => {

  //preto skombinovany, lebo tato aplikacia RegTabs cita zo spolocneho stavu data
  //aj z Tabmenu a aj z Pubs (ci je isFewPubs))
  const combinedReducer = combineReducers({
    Tabmenu: modules.Tabmenu.reducer,
    Pubs: modules.Pubs.reducer,
  })

  return combinedReducer
}
