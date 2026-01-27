import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**"]),

  {
    files: ["**/*.{ts,tsx,js,jsx}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint,
      "react-refresh": reactRefresh,
    },

    settings: {
      react: {
        version: "detect",
        jsxRuntime: "automatic", // <-- THIS is the key
      },
    },

    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      "react-refresh/only-export-components": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "func-call-spacing": ["error", "never"],
      "eol-last": ["warn", "always"],
      "object-curly-spacing": ["warn", "always"],
      "semi": ["warn", "always"],
      "no-trailing-spaces": [
        "warn",
        {
          "skipBlankLines": true,
        }
      ],
    },
  },
]);
