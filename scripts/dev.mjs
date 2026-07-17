import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function runCommand(command, args, options) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    cwd: rootDir,
    ...options,
  });

  child.on("error", (err) => {
    console.error(`Failed to start ${command}:`, err);
  });

  return child;
}

console.log("Starting Rakshak AI Services...");

// Start backend Express API server on port 5000
const backend = runCommand("pnpm", ["--filter", "@workspace/api-server", "run", "dev"], {
  env: {
    ...process.env,
    PORT: "5000",
    DATABASE_URL: "file:" + path.resolve(rootDir, "lib/db/sqlite.db"),
  },
});

// Start frontend React dev server on port 5173
const frontend = runCommand("pnpm", ["--filter", "@workspace/rakshak-ai", "run", "dev"], {
  env: {
    ...process.env,
    PORT: "5173",
    BASE_PATH: "/",
    DATABASE_URL: "file:" + path.resolve(rootDir, "lib/db/sqlite.db"),
  },
});

const cleanExit = () => {
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
