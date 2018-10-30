import React, {forwardRef, HTMLProps} from "react";
import {Link} from "react-static";

import {MenuItemData} from "../menu";

import {BlurText} from "../blur-text";

interface ProjectThumbTextualProps {
    itemData: MenuItemData;
    onHover: (d: MenuItemData | null) => void;
    blurPercent: number;
    color?: string;
}

import "./style.css";

export const ProjectThumbTextual: React.SFC<ProjectThumbTextualProps & HTMLProps<HTMLDivElement>> = (props) => {
    const {itemData, onHover, blurPercent, color="blue", ...rest} = props;

    return (
        <div className={"projectThumb textual"}
             onMouseEnter={(e) => onHover(itemData)}
             onMouseLeave={(e) => onHover(null)}
             {...rest}
        >
            <Link to={`/${itemData.slug}`}>
                <BlurText blurPercent={blurPercent}
                          fontSize={50}
                          color={color}
                >
                    <h1 className={"project-title"}>{itemData.title}</h1>
                </BlurText>
                <BlurText fontSize={16}
                          blurPercent={blurPercent}
                          color={"gray"}
                >
                    <small className={"sans-serif"}>
                        {itemData.people.join(", ")}
                        </small>
                </BlurText>
            </Link>
        </div>
    )
};
