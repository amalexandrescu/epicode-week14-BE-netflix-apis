import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouter from "./api/media/index.js";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import { join } from "path";
import swagger from "swagger-ui-express";
import yaml from "yamljs";

const server = express();

const port = process.env.PORT;
const yamlFile = yaml.load(join(process.cwd(), "./src/docs/apiDocs.yml"));

//Middlewares

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpts = {
  origin: (origin, corsNext) => {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      // If current origin is in the whitelist you can move on
      corsNext(null, true);
    } else {
      // If it is not --> error
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors());
server.use(express.json());

//Endpoints

server.use("/medias", mediaRouter);

//Error handlers

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
server.use("/docs", swagger.serve, swagger.setup(yamlFile));

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port: ", port);
});
