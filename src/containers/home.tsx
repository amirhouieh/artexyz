import React from "react"
import {Link, withSiteData} from 'react-static'

import {SiteData} from "../../data-module/types";
import {Overlay} from "../components/overlay";
import {GradBlurLetters} from "../components/grady-blury-text";
import {MenuItemData} from "../components/menu";

interface Props {
    sitedata: SiteData;
    menudata: MenuItemData[];
}

interface State {
    isOverlay: boolean;
}

class Home extends React.Component<Props, any> {
    render() {
        const {sitedata} = this.props;
        return (
            <Overlay>
                <h1 className={"sans-serif"}>
                    <GradBlurLetters text={sitedata.title}
                                     colors={['#000000', '#0071bc']}
                    />
                </h1>
                <br/>
                <h1>
                    <GradBlurLetters text={sitedata.description}
                                     colors={['#0071bc', '#000000']}
                    />
                </h1>
                <br/>
                <br/>
                <Link className={"sans-serif"}
                      style={{cursor: "pointer"}}
                      to={"/projects"}
                >
                    [SEE THE PROJECTS]
                </Link>
            </Overlay>
        )
    }
}

export default withSiteData(Home);
