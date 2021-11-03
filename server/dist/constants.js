"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTER_MUTATION = exports.ME_QUERY = exports.UPDATED_CARD_TEXT = exports.UPDATED_USERNAME = exports.REGISTER_PASSWORD = exports.REGISTER_USERNAME = exports.REGISTER_EMAIL = exports.HOST = exports.FORGET_PASS_PREFIX = exports.APP_DOMAIN_PREFIX = exports.IS_PROD = exports.COOKIE_NAME = void 0;
require("dotenv").config();
const { TEST_EMAIL, TEST_HOST, TEST_PASS, TEST_USERNAME } = process.env;
exports.COOKIE_NAME = "sid";
exports.IS_PROD = process.env.NODE_ENV === "production";
exports.APP_DOMAIN_PREFIX = exports.IS_PROD
    ? "https://not_made_yet"
    : "http://localhost:8080";
exports.FORGET_PASS_PREFIX = "forget-password:";
exports.HOST = TEST_HOST;
exports.REGISTER_EMAIL = TEST_EMAIL;
exports.REGISTER_USERNAME = TEST_USERNAME;
exports.REGISTER_PASSWORD = TEST_PASS;
exports.UPDATED_USERNAME = `newUsername${Date.now()}`;
exports.UPDATED_CARD_TEXT = "some update text for editing a card";
exports.ME_QUERY = `
  query me {
    me {
      email
      username
    }
  }
`;
exports.REGISTER_MUTATION = `
mutation register {
  register(options: {
    email: "${exports.REGISTER_EMAIL}",
    password: "${exports.REGISTER_PASSWORD}",
    username: "${exports.REGISTER_USERNAME}"
  }){
    token
    errors {
      field
      message
    }
    user{
      email
      username
      id
    }
  }
}
`;
//# sourceMappingURL=constants.js.map