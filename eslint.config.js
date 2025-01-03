import labegStyle from "@labeg/code-style";

/** @type {import("eslint").Linter.Config} */
export default [
    ...labegStyle,
    {
        rules: {
            "class-methods-use-this": "off"
        }
    }
];
