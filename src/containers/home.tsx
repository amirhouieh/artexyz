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
                <h2 className={"sans-serif"}>
                    <GradBlurLetters text={sitedata.title}
                                     colors={['#000000', '#0071bc']}
                    />
                </h2>
                <h1 style={{display: "none"}}>{sitedata.title}</h1>
                <br/>
                <h2>
                    <GradBlurLetters text={sitedata.description}
                                     colors={['#0071bc', '#000000']}
                    />
                </h2>
                <h1 style={{display: "none"}}>{sitedata.description}</h1>
                <br/>
                <br/>
                <div className={"links"}>
                    <small>
                        <a target={"_blank"} href={"https://amir.cloud"}>Amir Houieh</a>
                    </small>
                    <br/>
                    <small>
                        <a target={"_blank"} href={"https://artez.nl"}>Artez</a>
                    </small>
                    <br/>
                    <small>
                        <a target={"_blank"} href={"https://repub.amir.cloud"}>Repub project</a>
                    </small>
                </div>
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
