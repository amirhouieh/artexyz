import React, {createRef} from "react"
import gradstop from "gradstop";
import { throttle } from "lodash";
import shallowCompare from 'react-addons-shallow-compare'; // ES6

import {Point} from "../../types";
import {calcCenterPoint, calcDistance, mapRange} from "../../utils";
import {BlurText} from "../blur-text";


interface Props {
    text: string;
    colors: string[];
    fontSize?: number;
    minBlur?: number;
    maxBlur?: number;
}

interface State {
    lettersBlur: number[];
    lettersPosition: Point[];
    maxCursorDistance: number;
    containerBox: {
        start: Point;
        end: Point;
    }
}


export class GradBlurLetters extends React.PureComponent<Props, State> {
    private nodes: HTMLSpanElement[] = [];
    private container = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            lettersBlur: [],
            lettersPosition: [],
            maxCursorDistance: 1000,
            containerBox: {start: {x:0, y:0}, end: {x: 1000, y: 1000}}
        }

        this.onMouseMove = throttle(this.onMouseMove.bind(this), 250);
    }

    componentDidMount() {
        this.onResize();
        setTimeout(() => {this.onMouseMove(100, 50);}, 200);
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", (e) => this.onMouseMove(e.clientX, e.clientY));
        window.removeEventListener("resize", this.onResize);
    }

    onResize = () => {
        if(this.container.current){
            const box = this.container.current.getBoundingClientRect();
            const containerBox = {
                start: {x: box.left, y: box.top},
                end: {x: box.left+box.width, y: box.top+box.height}
            };
            const maxCursorDistance = calcDistance(containerBox.start, containerBox.end);
            this.setState({
                maxCursorDistance,
                containerBox
            }, () => {
                this.updateLettersCenterPosition();
            });
        }
    };

    onMouseMove = (x: number, y: number): void => {
        const {lettersPosition, maxCursorDistance} = this.state;
        const { maxBlur = 100, minBlur =0 } = this.props;

        const mouse: Point = {
            x: x - this.state.containerBox.start.x,
            y: y - this.state.containerBox.start.y
        };

        this.setState({
            lettersBlur: lettersPosition.map((pos, index) => {
                return ~~mapRange(calcDistance(pos, mouse), 0,  maxCursorDistance, minBlur, maxBlur)
            })
        })
    }

    updateLettersCenterPosition = () => {
        const positions = this.nodes.map((node) => {
            const absCenter: Point = calcCenterPoint(node.getBoundingClientRect());
            return {
                x: absCenter.x - this.state.containerBox.start.x,
                y: absCenter.y - this.state.containerBox.start.y,
            };
        })

        this.setState({
            lettersPosition: positions
        })
    }


    parseText = (txt: string): string[] =>
        txt.replace(/(?:\r\n|\r|\n)/g, '$').split("");

    render() {
        const { text, fontSize = 50 } = this.props;
        const letters = this.parseText(text)

        const colors = gradstop({
            stops: letters.length,
            inputFormat: 'hex',
            colorArray: this.props.colors
        });

        return (
            <div className={"grid-blur-letters-container"}
                 ref={this.container}
                 onMouseMove={(e) => this.onMouseMove(e.clientX, e.clientY)}
            >
                {
                    letters.map((letter, index) =>
                        <span className={"letter"}
                              key={`letter-${index}`}
                              ref={(ref) => this.nodes[index] = ref}
                        >
                            {
                                letter === "$"?
                                    <br/>
                                    :
                                    <BlurText fontSize={fontSize}
                                              blurPercent={this.state.lettersBlur[index]}
                                              color={colors[index]}
                                    >
                                        {letter}
                                    </BlurText>
                            }
                        </span>
                    )
                }
            </div>
        )
    }
}
