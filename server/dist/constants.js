"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_DOMAIN_PREFIX = exports.MOCK_EDIT_CARD = exports.MOCK_ADD_CARD = exports.IS_PROD = void 0;
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.MOCK_ADD_CARD = {
    frontSideLanguage: "dkfkdjf",
    frontSideText: "kdfjdkjf",
    frontSidePicture: "kdjfkdj",
    backSideText: "fjkdjkfdk",
    backSideLanguage: "dkjfkjd",
    backSidePicture: "kjdfkjdjk",
    creator: "test user",
};
exports.MOCK_EDIT_CARD = {
    frontSideLanguage: "edited language",
    frontSideText: "edited frontsideText",
    frontSidePicture: "kdjfkdj",
    backSideText: "fjkdjkfdk",
    backSideLanguage: "dkjfkjd",
    backSidePicture: "kjdfkjdjk",
};
exports.APP_DOMAIN_PREFIX = exports.IS_PROD
    ? "https://not_made_yet"
    : "http://localhost:8080";
//# sourceMappingURL=constants.js.map