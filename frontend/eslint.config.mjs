import next from "eslint-config-next";

export default [
  {
    ignores: ["node_modules/**", ".next/**"],
  },
  next(),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
