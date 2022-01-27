"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_DOMAIN_PREFIX = exports.MOCK_EDIT_CARD = exports.MOCK_ADD_CARD = exports.IS_PROD = void 0;
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.MOCK_ADD_CARD = {
    frontsideLanguage: "dkfkdjf",
    frontsideText: "kdfjdkjf",
    frontsidePicture: "kdjfkdj",
    backsideText: "fjkdjkfdk",
    creator: "test",
    backsideLanguage: "dkjfkjd",
    backsidePicture: "kjdfkjdjk",
};
exports.MOCK_EDIT_CARD = {
    frontsideLanguage: "edited",
    frontsideText: "kdfjdkjf",
    frontsidePicture: "kdjfkdj",
    backsideText: "fjkdjkfdk",
    backsideLanguage: "dkjfkjd",
    backsidePicture: "kjdfkjdjk",
};
exports.APP_DOMAIN_PREFIX = exports.IS_PROD
    ? "https://not_made_yet"
    : "http://localhost:8080";
//# sourceMappingURL=constants.js.map