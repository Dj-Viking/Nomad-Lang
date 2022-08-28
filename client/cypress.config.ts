import { defineConfig } from "cypress";

export default defineConfig({
  screenshotsFolder: "tests/e2e/fixtures/screenshots/actuals",
  viewportHeight: 1200,
  viewportWidth: 1400,
  video: false,
  trashAssetsBeforeRuns: false,
  projectId: "g6qzak",
  fixturesFolder: "tests/e2e/fixtures",
  videosFolder: "tests/e2e/videos",

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./tests/e2e/plugins/index.js")(on, config);
    },
    specPattern: "tests/e2e/specs/**/*.{js,jsx,ts,tsx}",
    supportFile: "tests/e2e/support/index.js",
  },

  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
  },
});
