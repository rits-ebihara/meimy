const { jestPreset: tsJest } = require('ts-jest');

module.exports = {
    ...tsJest,
    collectCoverageFrom: [
        "./src/**/*.ts?(x)",
        "!./src/index.ts",
        "!./src/account-manager/index.ts",
        "!**/node_modules/**",
    ],
    coverageReporters: [
        "html", "text"
    ],
    preset: "react-native",
    transform: {
        ...tsJest.transform,
        "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    },
    globals: {
        "ts-jest": {
            babelConfig: true,
        }
    },
    silent: false,
};