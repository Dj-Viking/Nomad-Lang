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
Object.defineProperty(exports, "__esModule", { value: true });
const flagpole_1 = require("flagpole");
(0, flagpole_1.default)("starting puppeteer", (suite) => __awaiter(void 0, void 0, void 0, function* () {
    suite
        .scenario("something", "browser")
        .open("http://localhost:8080/")
        .next((context) => __awaiter(void 0, void 0, void 0, function* () {
        context.assert(yield context.find("h2.title.mb-0")).exists();
        console.log("what is this keyword here", this);
        context.assert(window.navigator).exists();
    }));
}));
