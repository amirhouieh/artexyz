import React from "react";
import {Img} from "../../../data-module/types";

interface BlureImageProps {
    blurPX: number;
    data: Img;
}


export const BlurImage: React.SFC<BlureImageProps> = (props) => {
    const {blurPX, data: {width, height, ratio, filename}} = props;
    const src = `images/${filename}`;

    return (
        <div className={"blur-image"}
              style={{
                  background: `url("${src}") no-repeat center center`,
                  backgroundSize: "contain",

              }}
        >
            <div style={{
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                position: "relative"
            }}>
                <img src={src} style={{opacity: 0}}/>
                <div style={{
                    background: `url("${src}") no-repeat center center`,
                    backgroundSize: "contain",
                    overflow: "hidden",
                    filter: `blur(${blurPX}px)`,
                    width: "100%",
                    height: "100%",
                    top: "0",
                    left: "0",
                    position: "absolute",
                }}/>
            </div>
        </div>
    )
}
