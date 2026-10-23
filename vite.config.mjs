// Modified for Tofu: the build reads the pinned upstream commit date from
// tofu-upstream.json instead of running git, so it works without a checkout,
// and __GITHUB_BACKUP_ENABLED__ turns off the Netlify-dependent gist backup.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import favicons from "@peterek/vite-plugin-favicons";
import reScript from "@jihchi/vite-plugin-rescript";
import { readFileSync } from "node:fs";

const upstream = JSON.parse(
  readFileSync(new URL("./tofu-upstream.json", import.meta.url), "utf8"),
);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let plugins = [
    react({ include: ["**/*.res.mjs"] }),
    favicons("graphics/logo.svg"),
  ];
  // https://github.com/jihchi/vite-plugin-rescript/issues/231
  // Tests run on the compiled .res.mjs files, so they don't need the plugin;
  // its `rescript watch` child also breaks vitest's exit code at teardown.
  if (mode !== "test") {
    plugins.push(
      reScript({
        loader: {
          // output: './lib/bs',
          suffix: ".res.mjs",
        },
      }),
    );
  }
  return {
    plugins: plugins,
    server: {
      watch: {
        // ignore ReScript build artifacts
        ignored: ["**/lib/bs/**", "**/lib/ocaml/**", "**/lib/rescript.lock"],
      },
      port: 3000,
    },
    test: {
      include: ["tests/**/*_test.res.mjs"],
      globals: true,
      environment: "jsdom",
      setupFiles: "./tests/setup.js",
    },
    define: {
      __LAST_COMMIT_DATE__: JSON.stringify(upstream.date),
      __GITHUB_BACKUP_ENABLED__: JSON.stringify(false),
      __IS_TEST__: JSON.stringify(mode === "test"),
    },
  };
});
