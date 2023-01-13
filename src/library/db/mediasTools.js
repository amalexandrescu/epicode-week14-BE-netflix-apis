import uniqid from "uniqid";
import { getMedias, writeMedias } from "../fs/fsTools.js";

export const saveNewMedia = async (newMediaData) => {
  const medias = await getMedias();

  const newMedia = {
    ...newMediaData,
    imdbID: uniqid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    reviews: [],
  };

  medias.push(newMedia);

  await writeMedias(medias);

  return newMedia.imdbID;
};

export const findAllMedias = async () => getMedias();

export const findMediaById = async (mediaId) => {
  const medias = await getMedias();

  const media = medias.find((media) => media.imdbID === mediaId);

  return media;
};

export const findMediaByIdAndUpdate = async (mediaId, updates) => {
  const medias = await getMedias();
  const index = medias.findIndex((media) => media.imdbID === mediaId);

  if (index !== -1) {
    medias[index] = { ...medias[index], ...updates, updatedAt: new Date() };
    await writeMedias(medias);
    return medias[index];
  } else {
    return null;
  }
};
