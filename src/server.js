import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mediaRouter from "./api/media/index.js";
import {
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();

const port = process.env.PORT;

//Middlewares

server.use(cors());
server.use(express.json());

//Endpoints

server.use("/medias", mediaRouter);

//Error handlers

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port: ", port);
});
