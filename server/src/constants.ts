// require("dotenv").config();
// import { readEnv } from "./utils/readEnv";
// readEnv();
// const { TEST_EMAIL, TEST_HOST, TEST_PASS, TEST_USERNAME } = process.env;

import { ICard } from "types";

// export const COOKIE_NAME = "sid";

/* eslint-disable */
export const MOCK_CARD_CHOICES = [
  {
    text: "aiuhjfiuj",
  },
  {
    text: "aiuhjfiuj",
  },
  {
    text: "asf8eh3jf",
  },
];

export const IS_PROD: boolean | undefined = process.env.NODE_ENV === "production";
export const MOCK_ADD_CARD = {
  frontSideLanguage: "dkfkdjf",
  frontSideText: "kdfjdkjf",
  frontSidePicture: "kdjfkdj",
  backSideText: "fjkdjkfdk",
  backSideLanguage: "dkjfkjd",
  backSidePicture: "kjdfkjdjk",
  creator: "test user",
} as ICard;
export const MOCK_EDIT_CARD = {
  frontSideLanguage: "edited language",
  frontSideText: "edited frontsideText",
  frontSidePicture: "kdjfkdj",
  backSideText: "fjkdjkfdk",
  backSideLanguage: "dkjfkjd",
  backSidePicture: "kjdfkjdjk",
};

export const APP_DOMAIN_PREFIX: string | undefined = IS_PROD
  ? "https://https://nomad-lang.onrender.com"
  : "http://localhost:8080";
