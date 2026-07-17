import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:" + path.resolve(process.cwd(), "sqlite.db"),
  },
});
