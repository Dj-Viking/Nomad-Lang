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
const suite = (0, flagpole_1.default)("Basic Smoke Test of Site");
suite
    .scenario("Homepage Loads", "html")
    .open("/")
    .next((_context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("lloading homepage");
}));
suite
    .scenario("login page loads", "html")
    .open("/login")
    .next((_context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("loading login page");
}));
