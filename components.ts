/**
 * Exports all components plus adds React
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

export {React}
export {ReactDOM}

export {makeFullscreen} from "./makeFullscreen"
export {makeBeersApp, BeersDesktop, BeersMobile, BeersMobilePlaceholder} from "./Beers"

export {makeModuleApp} from "./apps"
export {makeRegTabsModule} from "./modules"

//pre DEV: exporty pre vyvoj/test v c.php
export {makeTestApp} from "./apps"
export {makeFeedModule} from "./modules"
export {makePubsModule} from "./modules"
export {makePubsByTypeModule} from "./modules"
export {makePubsByBeerModule} from "./modules"
export {makePubsByPriceModule} from "./modules"
export {makeTabmenuModule} from "./modules"
export {Test} from "./presents"
