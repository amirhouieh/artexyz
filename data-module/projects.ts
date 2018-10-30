import axios from "axios";
import * as csvParse from "csv-parse/lib/sync";

import {ProjectData, ProjectDataProps, ProjectRawData} from "./types";
import {downloadImage, downloadImages, parseMaterialsString} from "./utils";

import {IMAGE_DIR, PROJECTS_CSV_URL} from "./configs";
import slugify from "slugify";


export const buildProjects = async (): Promise<ProjectData[]> => {
    try {
        const res = await axios.get(PROJECTS_CSV_URL);
        const rawData: ProjectRawData[] = csvParse(res.data, {
            columns: [
                "time",
                ProjectDataProps.TITLE,
                ProjectDataProps.MANIFESTO,
                ProjectDataProps.PEOPLE,
                ProjectDataProps.THUMB,
                ProjectDataProps.LINK,
                ProjectDataProps.MATERIALS,
            ],
            from: 2,
            skip_lines_with_empty_values: true
        });

        const data: ProjectData[] = await Promise.all(
            rawData.map( async (project) => ({
                slug: slugify(project.title),
                title: project.title,
                manifesto: project.manifesto,
                people: project.people.split(",").map( (p) => p.trim()),
                link: project.link,
                thumb: await downloadImage(project.thumb, IMAGE_DIR),
                materials: await downloadImages( parseMaterialsString(project.materials), IMAGE_DIR )
            }))
        );

        console.log(`${data.length} projects are downloaded`);
        return data;
    }catch (e) {
        console.log(e);
        return [];
    }
};
