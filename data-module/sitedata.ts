import axios from "axios";
import * as csvParse from "csv-parse/lib/sync";

import {IMAGE_DIR, SITEDATA_URL} from "./configs";
import {SiteData, SiteDataRaw} from "./types";
import {downloadImage} from "./utils";

export const getSitedata = async (): Promise<SiteData> => {
    try {
        const res = await axios.get(SITEDATA_URL);
        const data: SiteDataRaw = csvParse(res.data, {
            columns: ["title", "description", "keywords", "thumb", "author"],
            from: 2,
            skip_lines_with_empty_values: true
        })[0];

        const thumb = await downloadImage(data.thumb, IMAGE_DIR);
        return {...data, thumb}

    }catch (e) {
        console.log(e);
        return null;
    }
};
