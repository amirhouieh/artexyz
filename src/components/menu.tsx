import React, {createRef} from "react"

import {Img, ProjectData} from "../../data-module/types";
import {calcCenterPoint, calcDistance, mapRange} from "../utils";
import {Point} from "../types";
import {ProjectThumbTextual} from "./project-thumb-textual";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-static";


export interface MenuItemData {
    title: string;
    slug: string;
    people: string[];
    thumb: Img;
}

interface Props {
    items: MenuItemData[];
}

interface State {
    hoveredProject: ProjectData | null;
    thumbsBlur: ProjectThumbBlur[];
    thumbsPosition: ProjectThumbRect[];
    maxCursorDistance: number;
    activeMenuItem: number | null;
}

export interface ProjectThumbRect {
    id: string,
    center: Point;
}

export interface ProjectThumbBlur {
    id: string,
    blur: number;
}


class MenuComponent extends React.Component<Props & RouteComponentProps<{}>, State> {
    private node = createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            hoveredProject: null,
            thumbsBlur: [],
            thumbsPosition: [],
            maxCursorDistance: 1000,
            activeMenuItem: null
        }
    }

    componentDidMount() {
        this.onResize();
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("resize", this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("resize", this.onResize);
    }

    onResize = () => {
        this.updateThumbsCenter();
        const maxCursorDistance = calcDistance({x: 0, y: 0}, {x: window.innerWidth, y: window.innerHeight});
        this.setState({
            maxCursorDistance
        })
    };

    onMouseMove = (e: MouseEvent) => {

        if(this.isHome()){
            return;
        }

        const {thumbsPosition, maxCursorDistance} = this.state;
        const mouse: Point = {x: e.clientX, y: e.clientY};

        this.setState({
            thumbsBlur: thumbsPosition.map((pos) => {
                return {
                    id: pos.id,
                    blur: mapRange(calcDistance(pos.center, mouse), 0,  maxCursorDistance, 0, 100)
                }
            })
        })
    }

    updateThumbsCenter = () => {
        if (this.node && this.node.current) {
            const positions: ProjectThumbRect[] = [];
            const thumbs = this.node.current.querySelectorAll(".projectThumb");

            for (const thumb of Array.from(thumbs)) {
                const center: Point = calcCenterPoint(thumb.getBoundingClientRect());
                if (thumb) {
                    positions.push({
                        id: thumb.id,
                        center: center
                    })
                }
            }
            this.setState({
                thumbsPosition: positions
            })
        }
    }


    onProjectHover = (project: ProjectData | null) => {
        this.setState({hoveredProject: project});
    };

    isHome = () => {
        return this.props.location.pathname === "/";
    };

    isProjects = () => {
        return this.props.location.pathname === "/projects";
    };

    render() {
        const {items, location: {pathname}} = this.props;
        const {thumbsBlur, hoveredProject} = this.state;
        const activeMenuItem = items.findIndex( (item) => pathname.indexOf(item.slug) > -1);

        return (
            <nav className={"menu"} ref={this.node}>
                <Link to={"/"}>
                    <h1>/</h1>
                </Link>
                <br/>
                <br/>
                {
                    items
                        .map((project, index) =>
                            <ProjectThumbTextual itemData={project}
                                                 key={`project-t-${index}`}
                                                 onHover={(d) => this.onProjectHover(d)}
                                                 id={project.slug}
                                                 blurPercent={
                                                     (
                                                         thumbsBlur.find((tb) => tb.id === project.slug)
                                                         ||
                                                         {blur: 50}
                                                     ).blur
                                                 }
                                                 style={{
                                                     opacity: activeMenuItem > -1 && activeMenuItem !== index ? 0.1: 1
                                                 }}
                            />
                        )
                }
            </nav>
        )
    }
}

export const Menu = withRouter<Props & RouteComponentProps<{}>>(MenuComponent)
