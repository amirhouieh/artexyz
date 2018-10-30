import * as url from "url";
import axios from "axios";
import {promisify} from "util";
import * as fileType from "file-type";
import * as streams from "memory-streams";
import * as fs from "fs";

// @ts-ignore
import * as sequential from "promise-sequential"

import {Img} from "./types";
import * as path from "path";
import {createWriteStream} from "fs";


export const readJson = <T>(filepath: string): T => {
    return JSON.parse(fs.readFileSync(filepath).toString('utf8'));
};

export const saveJson = <T>(filepath: string, data: T): void => {
    fs.writeFileSync(filepath, JSON.stringify(data));
};

export const saveJsonPretty = <T>(filepath: string, data: T): void => {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};


const getImageId = (link: string): string | null => {
    try {
        const urlObj = url.parse(link, true);
        return typeof urlObj.query.id === "string" ? urlObj.query.id : urlObj.query.id[0];
    } catch (e) {
        console.log(`Not a valid file url`);
        console.log(`${link}`);
        return null;
    }
}

const createDownloadLink = (id: string): string => {
    return `https://drive.google.com/uc?export=download&id=${id}`;
};

export const downloadFile = async (downloadLink: string, downloadPath: string): Promise<string> => {

    const response = await axios.get(downloadLink, {
        responseType: "stream"
    });

    //because we d not know the file types in advance so we do not
    //write them directly into a file, but we store the chunks in memory and write them at once
    let type: null|fileType.FileTypeResult = null;
    let chunks: Buffer[] = [];

    return new Promise<string>((resolve, reject) => {

        response.data.on('data', (chunk: any) => {
            chunks.push(chunk);
            if(type === null){
                type = fileType(chunk);
            }
        });

        response.data.on('end', () => {
            const buffer = Buffer.concat(chunks);

            let ext = type ? type.ext : "jpg";
            const filePath = `${downloadPath}.${ext}`;

            fs.open(filePath, 'w', function(err, fd) {
                if (err) {
                    throw `could not open file: ${filePath}` + err;
                }

                // write the contents of the buffer, from position 0 to the end,
                // to the file descriptor returned in opening our file
                fs.write(fd, buffer, 0, buffer.length, null, (err) => {
                    if (err) {
                        throw `error writing file: ${filePath}` + err;
                    }

                    fs.close(fd, () => {
                        console.log(`wrote the file successfully: ${filePath}`);
                        resolve(filePath);
                    });
                });
            });
        });

        response.data.on('error', () => {
            console.log("data err");
            reject()
        })
    })
}

export const downloadImage = async (imgLink: string, imgDir: string): Promise<Img|null> => {
    if(imgLink.trim().length === 0){
        console.log("EMPTY image link");
        return null;
    }

    const imgId = getImageId(imgLink);

    if (imgId) {
        try {
            const downloadLink = createDownloadLink(imgId);
            const downloadPath = `${imgDir}/${imgId}`;
            const imagePath = await downloadFile(downloadLink, downloadPath);
            console.log("im", imagePath)
            if(imagePath){
                const dimensions = await sizeOf(imagePath);
                return {
                    filename: path.basename(imagePath),
                    ...dimensions,
                    ratio: dimensions.width / dimensions.height
                }
            }else{
                console.log(`could not save file at ${imagePath}`);
            }
            return null;
        } catch (e) {
            console.log("Error downloading: ", imgId);
            console.log(e);
        }
    } else {
        return null;
    }
};

export const downloadImages = (images: string[], imgDir: string): Promise<Img[]> => {
    return sequential(
        images
            .filter((p) => p.trim().length > 0)
            .map((imgLink) => () => downloadImage(imgLink, imgDir))
            .filter((img) => img)
    )
};

export const parseMaterialsString = (materialsRawString: string): string[] => {
    return materialsRawString
        .split(", ")
        .filter((p) => p.trim().length > 0)
};


export const sizeOf = promisify(require("image-size"));
