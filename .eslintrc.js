const fs = require("node:fs")
const path = require("node:path")

const tsConfig = fs.existsSync("tsconfig.app.json")
  ? path.resolve("tsconfig.app.json")
  : undefined

module.exports = {
  extends: ["@ravnhq/eslint-config", "@ravnhq/eslint-config/react"],
  parserOptions: {
    ecmaVersion: 2022,
    project: tsConfig,
    sourceType: "module",
    debugLevel: true,
  },
  ignorePatterns: ["vite.config.ts", "dist", "coverage"],
}
