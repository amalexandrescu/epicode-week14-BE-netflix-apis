import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const mediasSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title field is a string and cannot be empty.",
    },
  },
  year: {
    in: ["body"],
    isInt: {
      errorMessage: "Year field is mandatory and needs to be a number.",
    },
  },
  type: {
    in: ["body"],
    isString: {
      errorMessage: "Type is a mandatory field and needs to be a string.",
    },
  },
  // poster: {
  //   in: ["body"],
  //   isString: {
  //     errorMessage:
  //       "Poster is a mandatory field. Please provide a valid URL for it.",
  //   },
  // },
};

//title, year, type,poster

export const checkNewMediaSchema = checkSchema(mediasSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    createHttpError(400, "Media validation has errors", {
      errorsList: errors.array(),
    });
  } else {
    next();
  }
};
