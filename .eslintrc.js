module.exports = {
    "env": {
        "es6": true,
        "node": true,
    },
    "extends": ["plugin:@typescript-eslint/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
        "project": "./tsconfig.json",
    },
    "plugins": [
        "react",
        "@typescript-eslint",
    ],
    "rules": {
        "eqeqeq": "error",
        "max-len": [
            "error",
            {
                "code": 120,
                "comments": 120,
            }
        ],
        "react/jsx-uses-react": [1],
        "react/jsx-uses-vars": [1],
        "@typescript-eslint/interface-name-prefix": [2, "always"],
        "@typescript-eslint/explicit-function-return-type": [0],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                "argsIgnorePattern": "^_"
            }
        ],
    },
    "parser": "@typescript-eslint/parser",
};