import * as React from "react";
import {createLogger} from "redux-logger";
import {Location} from "history";
import {PAGE} from "../constants";
import {AddTapPage} from "./AddTapPage";
import {TapsPage} from "./TapsPage";
import {DeleteTapsPage} from "./DeleteTapsPage";
import {EditTapPage} from "./EditTapPage";
import {Route, Switch} from "react-router";
import {TypeEditTapPage} from "./TypeEditTapPage";
import {PriceEditTapPage} from "./PriceEditTapPage";


interface IProps {
  location:Location
}

export const PageRouter = (props:IProps) => {
  // console.log('=== PageRouter.render():', props.location.pathname);
  return (
    <Switch location={props.location}>
      <Route path={PAGE.TapsPage} component={TapsPage} exact={true}/>
      <Route path={PAGE.DeleteTapsPage} component={DeleteTapsPage} exact={true}/>
      <Route path={PAGE.AddTapPage} component={AddTapPage} exact={true}/>
      <Route path={PAGE.EditTapPage} component={EditTapPage} exact={true}/>
      <Route path={PAGE.TypeEditTapPage} component={TypeEditTapPage} exact={true}/>
      <Route path={PAGE.PriceEditTapPage} component={PriceEditTapPage} exact={true}/>
    </Switch>
  )
}
