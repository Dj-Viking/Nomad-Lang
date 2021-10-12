import { ICard } from "@/types";
import {
  TextColor,
  BackgroundColor,
  LightBackGroundName,
  LightTextName,
} from "./types";

let EMAIL: string,
  PASSWORD: string,
  USERNAME: string,
  REGISTER_EMAIL: string,
  REGISTER_PASSWORD: string,
  REGISTER_USERNAME: string;
if (typeof Cypress !== "undefined") {
  /**
   * CYPRESS ENV EMAIL
   */
  USERNAME =
    Cypress && Cypress.env("USERNAME")
      ? Cypress.env("USERNAME")
      : "please define USERNAME in cypress.env.json";
  /**
   * CYPRESS ENV EMAIL
   */
  EMAIL =
    Cypress && Cypress.env("EMAIL")
      ? Cypress.env("EMAIL")
      : "please define EMAIL in cypress.env.json";
  /**
   * CYPRESS ENV PASSWORD
   */
  PASSWORD =
    Cypress && Cypress.env("PASSWORD")
      ? Cypress.env("PASSWORD")
      : "please define PASSWORD in cypress.env.json";
  /**
   * CYPRESS ENV REGISTER_PASSWORD
   */
  REGISTER_PASSWORD =
    Cypress && Cypress.env("REGISTER_PASSWORD")
      ? Cypress.env("REGISTER_PASSWORD")
      : "please define REGISTER_PASSWORD in cypress.env.json";
  /**
   * CYPRESS ENV REGISTER_EMAIL
   */
  REGISTER_EMAIL =
    Cypress && Cypress.env("REGISTER_EMAIL")
      ? Cypress.env("REGISTER_EMAIL")
      : "please define REGISTER_EMAIL in cypress.env.json";
  /**
   * CYPRESS ENV REGISTER_EMAIL
   */
  REGISTER_EMAIL =
    Cypress && Cypress.env("REGISTER_EMAIL")
      ? Cypress.env("REGISTER_EMAIL")
      : "please define REGISTER_EMAIL in cypress.env.json";
  /**
   * CYPRESS ENV REGISTER_EMAIL
   */
  REGISTER_USERNAME =
    Cypress && Cypress.env("REGISTER_USERNAME")
      ? Cypress.env("REGISTER_USERNAME")
      : "please define REGISTER_USERNAME in cypress.env.json";
}
export {
  USERNAME,
  EMAIL,
  PASSWORD,
  REGISTER_EMAIL,
  REGISTER_PASSWORD,
  REGISTER_USERNAME,
};

/**
 * localhost domain for the vue app
 */
export const LOCALHOST_URL = "http://localhost:8080";

/**
 * path to actuals when running headless cypress
 */
export const ACTUALS_HOMEREGRESSIONSPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/HomeRegression.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_LOADHOMESPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/LoadHome.spec.ts";
/**
 * path to actuals when running headless electron cypress
 */
export const ACTUALS_LOADHOMESPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/LoadHome.spec.ts";
/**
 * screenshots base directory
 */
export const SCREENSHOTS_BASE_PATH =
  "../client/tests/e2e/fixtures/screenshots/base";
/**
 * screenshots base directory
 */
export const SCREENSHOTS_ACTUALS_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_HOMEREGRESSIONSPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/HomeRegression.spec.ts";
/**
 * path to actuals when running headless electron cypress
 */
export const ACTUALS_SIGNUPREGRESSIONSPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/SignupRegression.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_SIGNUPUNITSPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/SignupUnit.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_SIGNUPREGRESSIONSPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/SignupRegression.spec.ts";
/**
 * path to actuals when running headless electron cypress
 */
export const ACTUALS_SIGNUPUNITSPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/SignupUnit.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_FORGOT_PASSWORD_REGRESSION_SPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/ForgotPasswordRegression.spec.ts";
/**
 * path to actuals when running headless electron cypress
 */
export const ACTUALS_FORGOT_PASSWORD_REGRESSION_SPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/ForgotPasswordRegression.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_CHANGE_PASSWORD_REGRESSION_SPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/ChangePasswordRegression.spec.ts";
/**
 * path to actuals when running headless electron cypress
 */
export const ACTUALS_CHANGE_PASSWORD_REGRESSION_SPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/ChangePasswordRegression.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_CARDUNITSPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/CardUnit.spec.ts";
/**
 * path to actuals when running headless electron cypress
 */
export const ACTUALS_CARDUNITSPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/CardUnit.spec.ts";
/**
 * path to the actuals screenshots folder
 * for some reason I have to use this path because when running the fs function with the path ../ it starts from the root folder of this repository project
 */
export const ACTUALS_LOGINREGRESSIONSPEC_PATH =
  "../client/tests/e2e/fixtures/screenshots/actuals/LoginRegression.spec.ts";
/**
 * path to the spec folder while running headless electron cypress
 */
export const ACTUALS_LOGINREGRESSIONSPEC_PATH_HEADLESS =
  "./tests/e2e/fixtures/screenshots/actuals/LoginRegression.spec.ts";

/**
 * path the the base home link screenshot fixture
 */
export const BASE_HOMELINK_VIEW_FIXTURE =
  "/screenshots/base/LoadHome.spec.ts/Check-the-nav-bar-for-the-correct-nav-links -- screenshots-the-home-view-window.png";

/**
 * path to the actual home link screenshot fixture
 */
export const ACTUAL_HOMELINK_VIEW_FIXTURE =
  "/screenshots/actuals/LoadHome.spec.ts/Check-the-nav-bar-for-the-correct-nav-links -- screenshots-the-home-view-window.png";
/**
 * path to the actual home link screenshot fixture
 */
export const DIFF_FIXTURE_FOLDER_PATH = "./tests/e2e/fixtures/screenshots/diff";

/**
 * match num calculation path to the base png file
 */
export const PATH_TO_ACTUAL_FROM_TASK_FUNCTION =
  "./tests/e2e/fixtures/screenshots/actuals/LoadHome.spec.ts/Check-the-nav-bar-for-the-correct-nav-links -- screenshots-the-home-view-window.png";

/**
 * match num calculation path to the base png file
 */
export const PATH_TO_BASE_FROM_TASK_FUNCTION =
  "./tests/e2e/fixtures/screenshots/base/LoadHome.spec.ts/Check-the-nav-bar-for-the-correct-nav-links -- screenshots-the-home-view-window.png";

/**
 * path to the base home page screenshot fixture
 */
export const BASE_HOME_FULL_PAGE_FIXTURE =
  "/screenshots/base/HomeRegression.spec.ts/home-page-regression -- screenshots-the-entire-page";

/**
 * path to the actual home page screenshot fixture
 */
export const ACTUAL_HOME_FULL_PAGE_FIXTURE =
  "/screenshots/actuals/HomeRegression.spec.ts/home-page-regression -- screenshots-the-entire-page";

/**
 * path to the base forgot pass page screenshot fixture
 */
export const BASE_FORGOTPASS_FULL_PAGE_FIXTURE =
  "/screenshots/base/ForgotPasswordRegression.spec.ts/forgotpass-page-regression -- screenshots-the-entire-page";

/**
 * path to the actual forgot pass page screenshot fixture
 */
export const ACTUAL_FORGOTPASS_FULL_PAGE_FIXTURE =
  "/screenshots/actuals/ForgotPasswordRegression.spec.ts/forgotpass-page-regression -- screenshots-the-entire-page";
/**
 * path to the base change pass page screenshot fixture
 */
export const BASE_CHANGEPASS_FULL_PAGE_FIXTURE =
  "/screenshots/base/ChangePasswordRegression.spec.ts/changepass-page-regression -- screenshots-the-entire-page";

/**
 * path to the actual change pass page screenshot fixture
 */
export const ACTUAL_CHANGEPASS_FULL_PAGE_FIXTURE =
  "/screenshots/actuals/ChangePasswordRegression.spec.ts/changepass-page-regression -- screenshots-the-entire-page";

/**
 * path to the actual login page screenshot fixture
 */
export const BASE_LOGIN_FULL_PAGE_FIXTURE =
  "/screenshots/base/LoginRegression.spec.ts/login-page-regression -- screenshots-the-login-page";

/**
 * path to the actual login page screenshot fixture
 */
export const BASE_SIGNUP_FULL_PAGE_FIXTURE =
  "/screenshots/base/SignupRegression.spec.ts/signup-page-regression -- screenshots-the-signup-page";
/**
 * path to the actual login page screenshot fixture
 */
export const ACTUAL_SIGNUP_FULL_PAGE_FIXTURE =
  "/screenshots/actuals/SignupRegression.spec.ts/signup-page-regression -- screenshots-the-signup-page";
/**
 * path to the actual login page screenshot fixture
 */
export const ACTUAL_LOGIN_FULL_PAGE_FIXTURE =
  "/screenshots/actuals/LoginRegression.spec.ts/login-page-regression -- screenshots-the-login-page";

/**
 * the actual file name including the extension
 */
export const LOGIN_SCREENSHOT_FILE_NAME =
  "login-page-regression -- screenshots-the-login-page.png";

/**
 * the actual file name including the extension
 */
export const HOME_SCREENSHOT_FILE_NAME =
  "home-page-regression -- screenshots-the-entire-page.png";
/**
 * the actual file name including the extension
 */
export const FORGOT_PASSWORD_SCREENSHOT_FILE_NAME =
  "forgotpass-page-regression -- screenshots-the-entire-page.png";
/**
 * the actual file name including the extension
 */
export const CHANGE_PASSWORD_SCREENSHOT_FILE_NAME =
  "changepass-page-regression -- screenshots-the-entire-page.png";

/**
 * the actual file name including the extension
 */
export const SIGNUP_SCREENSHOT_FILE_NAME =
  "signup-page-regression -- screenshots-the-signup-page.png";
export const textColors: Array<TextColor> = [
  "danger",
  "success",
  "warning",
  "info",
  "link",
  "primary",
];

export const backgroundColors: Array<BackgroundColor> = [
  "danger-back",
  "success-back",
  "warning-back",
  "info-back",
  "link-back",
  "primary-back",
  "white-back",
];

export const lightBackgroundNames: Array<LightBackGroundName> = [
  "light-danger-back",
  "light-success-back",
  "light-warning-back",
  "light-info-back",
  "light-link-back",
  "light-primary-back",
  "light-white-back",
];

export const lightTextNames: Array<LightTextName> = [
  "light-danger",
  "light-success",
  "light-warning",
  "light-info",
  "light-link",
  "light-primary",
];

// export const EDITED_CARD_FIXTURE_PATH = "editedCardInstance.json";

export const EXPECTED_ADD_LOCAL_CARD_OBJECT: ICard = {
  id: 0,
  creatorId: 0,
  frontSideText: "front side text",
  frontSideLanguage: "front side text language",
  frontSidePicture: "front side picture",
  backSideText: "back side text",
  backSideLanguage: "back side text language",
  backSidePicture: "",
  color: "blue",
};
EXPECTED_ADD_LOCAL_CARD_OBJECT.backSidePicture =
  EXPECTED_ADD_LOCAL_CARD_OBJECT.frontSidePicture;

export const EXPECTED_EDIT_LOCAL_CARD_OBJECT: ICard = {
  frontSideText: "edited text we expect to be here",
  frontSideLanguage: "RU",
  frontSidePicture: "dkfdkjf",
  backSideText: "backside text",
  backSideLanguage: "backside language",
  backSidePicture: "",
  createdAt: "right now",
  updatedAt: "right now",
  creatorId: 0,
  __typename: "Card",
};
EXPECTED_EDIT_LOCAL_CARD_OBJECT.backSidePicture =
  EXPECTED_EDIT_LOCAL_CARD_OBJECT.frontSidePicture;
