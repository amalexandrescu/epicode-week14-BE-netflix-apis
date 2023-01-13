import { write } from "fs";
import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { writeJSON, readJSON, writeFile } = fs;

const mediasJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/medias.json"
);

const publicFolderPath = join(process.cwd(), "./public/img/medias");

console.log(publicFolderPath);

console.log(mediasJSONPath);

export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (mediasArray) =>
  writeJSON(mediasJSONPath, mediasArray);

export const saveMediaPictures = (fileName, fileContentAsABuffer) => {
  writeFile(join(publicFolderPath, fileName), fileContentAsABuffer);
};
