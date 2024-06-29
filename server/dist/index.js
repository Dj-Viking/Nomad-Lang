"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const helpers_1 = require("./__tests__/utils/helpers");
const path_1 = __importDefault(require("path"));
const connection_1 = __importDefault(require("./db/connection"));
const readEnv_1 = require("./utils/readEnv");
(0, readEnv_1.readEnv)();
const PORT = process.env.PORT || 4000;
const logger = helpers_1.ColorLog;
const { CORS_ALLOWED_PROD, CORS_ALLOWED_DEV, } = process.env;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("hello world");
        const app = (0, express_1.default)();
        const corsRegExp = (() => {
            if (constants_1.IS_PROD) {
                return new RegExp(CORS_ALLOWED_PROD, "g");
            }
            return new RegExp(CORS_ALLOWED_DEV, "g");
        })();
        console.log("WHAT IS THE REGEX HERE", corsRegExp);
        app.use((0, cors_1.default)({
            origin: corsRegExp,
            credentials: true,
        }));
        app.use(express_1.default.urlencoded({
            extended: false,
        }));
        app.use(express_1.default.json());
        console.log("===================");
        console.log("WHAT IS CURRENT DIR", __dirname);
        console.log("===================");
        app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
        app.use(router_1.default);
        if (process.env.NODE_ENV === "production") {
            app.use((req, res, next) => {
                if (req.header("x-forwarded-proto") !== "https")
                    res.redirect(`https://${req.header("host")}${req.url}`);
                next();
            });
        }
        connection_1.default.then(() => {
            app.listen(PORT, () => {
                new logger("green", `server started on ${PORT}`).genLog();
            });
        });
    });
})().catch((e) => {
    return console.error(e);
});
//# sourceMappingURL=index.js.map