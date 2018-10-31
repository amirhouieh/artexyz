import React from 'react'
import {Link, withRouteData} from 'react-static'

import {ProjectData, SiteData} from "../../data-module/types";
import {GradBlurLetters} from "../components/grady-blury-text";
import {randInt} from "../utils";
import {Seo} from "../components/seo";

interface Props {
    data: ProjectData
    sitedata: SiteData;
}

export default withRouteData(({data, sitedata}: Props) => {
    return (
        <div className={"project"}>
            <Seo sitedata={sitedata}
                 seo={{
                    description: data.manifesto,
                    title: data.title,
                    thumb: data.thumb,
                }}
                 pathname={data.slug}
            />
            {
                <article>
                    <GradBlurLetters colors={["#000000", "#eeeeee"]}
                                     text={`${data.manifesto}                 \n\n`}
                                     maxBlur={20}
                    />
                </article>
            }

            <a href={data.link} target={"_blank"}>
                <small className={"sans-serif"}>{data.link}</small>
            </a>
            <br/>
            <div>
                {
                    data.materials.map((mat, index) =>
                        <Link key={`mat-${index}`}
                              to={`images/${mat.filename}`}
                              target={"_blank"}
                        >
                            <img src={`images/${mat.filename}`}
                                 style={{
                                     width: `${[10,25,50,75][randInt(0,3)]}%`
                                 }}
                            />
                        </Link>
                    )
                }
            </div>
        </div>
    )
})
