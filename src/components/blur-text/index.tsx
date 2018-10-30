import React, {HTMLProps} from "react";
import {mapRange} from "../../utils";

interface BlureTextProps {
    fontSize: number;
    blurPercent?: number;
    color?: string;
}


export const BlurText: React.SFC<BlureTextProps> = (props) => {
    const {fontSize, blurPercent, color="black"} = props;
    const b = typeof blurPercent !== "undefined" ? blurPercent : 50;
    const blurPX = mapRange(b, 0, 100, 0, fontSize);
    return (
        <span className={"blur-text"}
              style={{
                  textShadow: `0 0 ${blurPX}px ${color}`,
                  color: "transparent"
              }}
        >
            {props.children}
        </span>
    )
}
