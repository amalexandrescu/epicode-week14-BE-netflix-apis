import express from "express";
import createHttpError from "http-errors";
import {
  findMediaById,
  findAllMedias,
  saveNewMedia,
  findMediaByIdAndUpdate,
} from "../../library/db/mediasTools.js";

import {
  checkNewMediaSchema,
  checkValidationResult,
} from "./mediaValidation.js";

import multer from "multer";
import {
  getMedias,
  saveMediaPictures,
  writeMedias,
} from "../../library/fs/fsTools.js";

import { extname } from "path";

import { pipeline } from "stream";
import { getPDFReadableStream } from "../../library/pdf/pdfTools.js";

const { NotFound } = createHttpError;

const mediaRouter = express.Router();

mediaRouter.post(
  "/",
  checkNewMediaSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const mediaId = await saveNewMedia(req.body);
      res.status(201).send({ mediaId });
    } catch (error) {
      next(error);
    }
  }
);

mediaRouter.get("/", async (req, res, next) => {
  try {
    const medias = await findAllMedias();
    res.send(medias);
  } catch (error) {
    next(error);
  }
});

mediaRouter.get("/:id", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.id);
    if (media) {
      res.send(media);
    } else {
      next(NotFound(`Media with id: ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

mediaRouter.post(
  "/:id/poster",
  multer().single("mediaPicture"),
  async (req, res, next) => {
    try {
      // console.log("file posting req body", req.body);
      // console.log("file posting req.file", req.file);

      const fileName = req.params.id + extname(req.file.originalname);

      const media = await findMediaByIdAndUpdate(req.params.id, {
        poster: `/img/products/${fileName}`,
      });

      if (media) {
        await saveMediaPictures(fileName, req.file.buffer);
        res.send(media);
      } else {
        next(NotFound(`Media with id ${req.params.id} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

mediaRouter.get("/:id/pdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

  const medias = await findAllMedias();
  const source = getPDFReadableStream(medias, req.params.id);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

export default mediaRouter;
