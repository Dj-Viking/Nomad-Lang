/* eslint-disable prettier/prettier */
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
console.log("what is nodeenv", process.env.NODE_ENV);

(async function (): Promise<void> {
    console.log("hello world");

    const app = express();

    app.use(
        cors({
            origin: IS_PROD ? "https://nomad-lang.onrender.com" : "http://localhost:8080",
            credentials: true,
        })
    );

    app.use(
        express.urlencoded({
            extended: false,
        })
    );
    app.use(express.json());
    console.log("===================");
    console.log("WHAT IS CURRENT DIR", __dirname);
    console.log("===================");
    app.use(express.static(path.join(__dirname, "../../client/dist")));
    app.use(router);

    //IF-ENV IN PRODUCTION
    if (process.env.NODE_ENV === "production") {
        //STATIC ASSETS FROM VUE BUILD FOLDER
        // IF TRAVELS ANY ROUTE OUTSIDE VUE'S CURRENT PAGE REDIRECT TO ROOT
        //REDIRECT HTTP TRAFFIC TO HTTPS
        app.use((req, res, next) => {
            if (req.header("x-forwarded-proto") !== "https")
                res.redirect(`https://${req.header("host")}${req.url}`);
            next();
        });
    }

    //SERVER LISTEN
    connection.then(() => {
        app.listen(PORT, () => {
            new logger("green", `server started on ${PORT}`).genLog();
        });
    });
})().catch((e: Error) => {
    return console.error(e);
});
