"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_DOMAIN_PREFIX = exports.IS_PROD = void 0;
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.APP_DOMAIN_PREFIX = exports.IS_PROD
    ? "https://not_made_yet"
    : "http://localhost:8080";
//# sourceMappingURL=constants.js.map