import esbuild from "esbuild";
import process from "process";

const production = process.argv[2] === "production";

esbuild.build({
  entryPoints: ["main.ts"],
  bundle: true,
  external: ["obsidian"],
  format: "cjs",
  target: "es6",
  outfile: "main.js",
  sourcemap: !production,
  minify: production,
});
