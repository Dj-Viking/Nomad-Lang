/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

// var __importDefault =
//   (this && this.__importDefault) ||
//   function (mod) {
//     return mod && mod.__esModule ? mod : { default: mod };
//   };
// Object.defineProperty(exports, "__esModule", { value: true });

// eslint-disable-next-line
// const registerCodeCoverageTasks = require("@cypress/code-coverage/task");
// eslint-disable-next-line
// const fs = require("fs")
// eslint-disable-next-line
const { deleteActuals } = require("../../utils/deleteActuals");
// eslint-disable-next-line
const { writeDiff } = require("../../utils/writeDiff");
// eslint-disable-next-line
const { deleteDiff } = require("../../utils/deleteDiff");

module.exports = (on, config) => {
  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.name === "chrome" && browser.isHeadless) {
      // fullPage screenshot size is 1400x1200 on non-retina screens
      // and 2800x2400 on retina screens
      launchOptions.args.push("--window-size=1400,1200");

      // force screen to be non-retina (1280x720 size)
      launchOptions.args.push("--force-device-scale-factor=1");

      // force screen to be retina (2560x1440 size)
      // launchOptions.args.push('--force-device-scale-factor=2')
    }

    if (browser.name === "electron" && browser.isHeadless) {
      // fullPage screenshot size is 1280x720
      launchOptions.preferences.width = 1400;
      launchOptions.preferences.height = 1200;
    }

    if (browser.name === "firefox" && browser.isHeadless) {
      // menubars take up height on the screen
      // so fullPage screenshot size is 1400x1126
      launchOptions.args.push("--width=1400");
      launchOptions.args.push("--height=1200");
    }

    return launchOptions;
  });
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))
  on("task", {
    // registerCodeCoverageTasks(on, config)
    deleteActuals: function (path) {
      deleteActuals(path);
      return null;
    },

    writeDiff: async function (args) {
      console.log("args to pass to write diff", args);
      const result = await writeDiff(args);
      console.log("result", result);
      return result;
    },

    deleteDiff: async function (args) {
      console.log("args to pass to delete diff", args);
      const result = await deleteDiff(args);
      console.log("result", result);
      return result;
    },
  });

  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js",
  });
};
