module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  testMatch: ["**/?(*.)+(spec|test).ts"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
