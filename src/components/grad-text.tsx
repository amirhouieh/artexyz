import React from "react";
import gradstop from "gradstop";

interface Props {
    text: string;
    colors: string[];
}




export const GradTypo: React.SFC<Props> = (props) => {
    const { text, colors } = props;
    const chars = text.split("");

    // const grad = Gradient(colors, chars.length);
    // const colorSteps = grad.toArray();

    const gradient = gradstop({
        stops: chars.length,
        inputFormat: 'hex',
        colorArray: colors
    });

    return chars.map((char, index) =>
        <span style={{color: gradient[index]}}>
            {char}
        </span>
    )
};
