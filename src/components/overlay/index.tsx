import React from "react";

import "./style.css";

export const Overlay: React.SFC = (props) => {
    return(
        <div className={"overlay"}>
            <div className={"overlay-container"}>
                {props.children}
            </div>
        </div>
    )
};
