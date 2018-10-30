import React from 'react'
import {withRouteData} from 'react-static'

import {ProjectData} from "../../data-module/types";
import {GradBlurLetters} from "../components/grady-blury-text";
import {randInt} from "../utils";

interface Props {
    data: ProjectData
}

export default withRouteData(({data}: Props) => {
    return (
        <div className={"project"}>
            {
                <p>
                    <GradBlurLetters colors={["#000000", "#eeeeee"]}
                                     text={`${data.manifesto}                 \n\n`}
                                     maxBlur={20}
                    />
                </p>
            }

            <a href={data.link} target={"_blank"}>
                <small className={"sans-serif"}>{data.link}</small>
            </a>
            <br/>
            <div>
                {
                    data.materials.map((mat, index) =>
                        <img src={`images/${mat.filename}`}
                             key={`mat-${index}`}
                             style={{
                                 width: `${[10,25,50,75][randInt(0,3)]}%`
                             }}
                        />
                    )
                }
            </div>
        </div>
    )
})
