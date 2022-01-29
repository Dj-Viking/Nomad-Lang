import express from "express";
import router from "./router";

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);
  return app;
}

export default createServer;
