import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/?(*.)+(spec|test).ts"],
    globalSetup: "../server/globalSetup.ts",
    globalTeardown: "../server/globalTeardown.ts"
  }
}