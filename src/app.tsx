import React from "react"
import {Router, withSiteData} from "react-static"
import { hot } from "react-hot-loader"
//
import Routes from "react-static-routes"

import "./app.css"
import {Menu, MenuItemData} from "./components/menu";
import {SiteData} from "../data-module/types";

interface Props {
    sitedata: SiteData;
    menudata: MenuItemData[];
}

const App = (props: Props) => (
  <Router>
    <div>
      <Menu  items={props.menudata} />
      <div className="content">
        <Routes />
      </div>
    </div>
  </Router>
)

export default hot(module)(withSiteData(App))
