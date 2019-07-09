const { jestPreset: tsJest } = require('ts-jest');

module.exports = {
    ...tsJest,
    testMatch: [
        '**/__tests__/**/*.test.ts?(x)',
    ],
    collectCoverageFrom: [
        "./src/**/*.ts?(x)",
        "!./src/index.ts",
        "!./src/test/**/*",
        "!./src/account-manager/index.ts",
        "!**/node_modules/**",
        "!",
    ],
    coverageReporters: [
        "html", "text", "lcov"
    ],
    preset: "react-native",
    transform: {
        ...tsJest.transform,
        "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    },
    globals: {
        "ts-jest": {
            babelConfig: true,
        },
    },
    silent: false,
    reporters: [
        "default", [
            "./node_modules/jest-html-reporter",
            {
                pageTitle: "Miemy Unit Test Report",
                outputPath: "./coverage/test-report.html",
                includeFailureMsg: true,
                includeConsoleLog: true,
            }
        ]
    ],
    transformIgnorePatterns: [
        "/node_modules/(?!native-base)/",
        "/node_modules/(?!react-native-cookies)/",
    ],
};