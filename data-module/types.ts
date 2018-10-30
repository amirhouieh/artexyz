
export enum ProjectDataProps {
    TITLE ="title",
    MANIFESTO = "manifesto",
    PEOPLE = "people",
    THUMB = "thumb",
    MATERIALS = "materials",
    LINK = "link"
}

export interface Img {
    filename: string;
    width: string;
    height: string;
    ratio: string;
}

export interface ProjectRawData {
    title: string;
    manifesto: string;
    people: string;
    thumb: string;
    materials: string;
    link: string;
}

export interface ProjectData {
    title: string;
    slug: string;
    manifesto: string;
    people: string[];
    thumb: Img;
    materials: Img[];
    link: string;
}

export interface SiteDataRaw {
    title: string;
    description: string;
    tags: string;
    thumb: string;
    author: string;
}

export interface SiteData {
    title: string;
    description: string;
    tags: string;
    thumb: Img;
    author: string;
}
