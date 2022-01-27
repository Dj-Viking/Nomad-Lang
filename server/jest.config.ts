import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    collectCoverageFrom: [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/db/connection.ts",
      "!src/__tests__/*.ts",
      "!src/__tests__/**/*.ts",
      "!src/index.ts",
      "!src/types.ts",
      "!src/resolvers/*.ts",
      "!src/entities/*.ts",
    ],
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/?(*.)+(spec|test).ts"],
    globalSetup: "../server/globalSetup.ts",
    globalTeardown: "../server/globalTeardown.ts"
  }
}