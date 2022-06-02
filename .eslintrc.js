/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
    extends: [
        "@remix-run/eslint-config",
        "@remix-run/eslint-config/node",
        "@remix-run/eslint-config/jest-testing-library",
        "prettier",
    ],
    // we're using vitest which has a very similar API to jest
    // (so the linting plugins work nicely), but it means we have to explicitly
    // set the jest version.
    settings: {
        jest: {
            version: 27,
        },
    },
    rules: {
        // "prettier/prettier": ["error"],
        "@typescript-eslint/no-unused-vars": ["error"],
        "@typescript-eslint/no-loss-of-precision": ["off"],
        "@typescript-eslint/no-var-requires": ["off"],
        "@typescript-eslint/no-empty-interface": ["off"],
        "@typescript-eslint/ban-types": ["off"],
        "@typescript-eslint/explicit-module-boundary-types": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-non-null-assertion": ["off"],
        "@typescript-eslint/no-empty-function": ["off"],
        "no-prototype-builtins": ["off"],
        "no-debugger": ["error"],
        "require-yield": ["off"],
        "no-extra-boolean-cast": ["off"],
        "react-hooks/exhaustive-deps": ["off"],
    },
};
