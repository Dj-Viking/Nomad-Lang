import express from "express";
import router from "../router";
export async function TestServer(): Promise<Express.Application> {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);
  return app;
}
