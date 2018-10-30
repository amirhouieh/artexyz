import React from "react";
import {Link} from "react-static";

import {ProjectData} from "../../../data-module/types";

interface ProjectThumbProps {
    data: ProjectData;
}

import "./style.css";
import {BlurText} from "../blur-text";
import {BlurImage} from "../blur-image";

export const ProjectThumb: React.SFC<ProjectThumbProps> = ({data}) => {

    return(
        <div className={"projectThumb"}>
            <Link to={`/${data.slug}`} className={"project-title"}>
                <BlurText blurPercent={50}
                          fontSize={34}
                          color={"blue"}
                >
                    <h1>{data.title}</h1>
                </BlurText>
            </Link>
            {
                data.thumb &&
                <BlurImage data={data.thumb}
                           blurPX={3}
                />
            }
        </div>
    )
};
