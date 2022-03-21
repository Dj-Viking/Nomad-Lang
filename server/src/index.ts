require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { IS_PROD } from "./constants";
import cors from "cors";
import router from "./router";
import { ColorLog } from "./__tests__/utils/helpers";
import path from "path";
import connection from "./db/connection";
import { readEnv } from "./utils/readEnv";
readEnv();

const PORT = process.env.PORT || 4000;
const logger = ColorLog;

const {
  CORS_ALLOWED_PROD,
  CORS_ALLOWED_DEV,
  // NODEMAILER_EMAIL_TO
} = process.env;

(async function (): Promise<void> {
  console.log("hello world");

  const app = express();

  const corsRegExp = ((): RegExp => {
    if (IS_PROD) {
      return new RegExp(CORS_ALLOWED_PROD as string);
    }
    return new RegExp(CORS_ALLOWED_DEV as string);
  })();

  app.use(
    cors({
      origin: corsRegExp,
      credentials: true,
    })
  );
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(express.json());
  app.use(router);

  //IF-ENV IN PRODUCTION
  if (process.env.NODE_ENV === "production") {
    //STATIC ASSETS FROM VUE BUILD FOLDER
    app.use(express.static(path.join(__dirname, "../../client/dist")));
    // IF TRAVELS ANY ROUTE OUTSIDE VUE'S CURRENT PAGE REDIRECT TO ROOT
    // app.get('*', (_req, res, next) => {
    //   res.sendFile(path.join(
    //     __dirname, '../client/dist/index.html'
    //   ));
    //   next();
    // });
    //REDIRECT HTTP TRAFFIC TO HTTPS
    app.use((req, res, next) => {
      if (req.header("x-forwarded-proto") !== "https")
        res.redirect(`https://${req.header("host")}${req.url}`);
      next();
    });
  }

  app.use("/", async (_, res) => {
    res.status(404).send("client path eventually");
  });

  //SERVER LISTEN
  connection.then(() => {
    app.listen(PORT, () => {
      new logger("green", `server started on ${PORT}`).genLog();
    });
  });
})().catch((e: Error) => {
  return console.error(e);
});
