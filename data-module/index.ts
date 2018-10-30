import {getSitedata} from "./sitedata";
import {buildProjects} from "./projects";
import {saveJson, saveJsonPretty} from "./utils";
import {DATABASE_PATH, DATABASE_PATH_PRETTY} from "./configs";

(async () => {
    const projects = await buildProjects();
    const sitedata = await getSitedata();

    await saveJson(DATABASE_PATH, {projects, sitedata});
    await saveJsonPretty(DATABASE_PATH_PRETTY, {projects, sitedata});
    console.log(`database is made: ${DATABASE_PATH}`);
})();




