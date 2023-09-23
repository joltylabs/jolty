import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.esm.js",
    output: {
      file: "dist/jolty.esm.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: "src/index.esm.js",
    output: {
      file: "dist/jolty.esm.min.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), terser()],
  },
  {
    input: "src/index.esm.js",
    output: {
      name: "jolty",
      file: "dist/jolty.js",
      format: "umd",
      sourcemap: true,
      extend: true,
      globals: {
        jolty: "jolty",
      },
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: "src/index.esm.js",
    output: {
      name: "jolty",
      file: "dist/jolty.min.js",
      format: "umd",
      sourcemap: true,
      extend: true,
      globals: {
        jolty: "jolty",
      },
    },
    plugins: [resolve(), commonjs(), terser()],
  },
];
