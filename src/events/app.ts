import express, { urlencoded } from "express";
import cors from "cors";
import { notFound } from "../api/middleware/notfound.middleware";
import { ErrorHandler } from "../api/middleware/error.middleware";
import { api } from "../api/routes";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use(urlencoded({ extended: true }));

  app.use("/api", api);

  app.use(notFound);

  app.use(ErrorHandler);

  return app;
}
