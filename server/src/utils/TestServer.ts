import express from "express";
export async function TestServer(): Promise<Express.Application> {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  return app;
}
