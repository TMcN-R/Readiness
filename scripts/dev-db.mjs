import { existsSync } from "node:fs";
import EmbeddedPostgres from "embedded-postgres";

const DATA_DIR = "./.devdata/pgdata";

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

if (!existsSync(DATA_DIR)) {
  await pg.initialise();
}
await pg.start();
await pg.createDatabase("orra").catch(() => {});

console.log("Local dev Postgres running on port 5433, database 'orra'");

process.stdin.resume();

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, async () => {
    await pg.stop();
    process.exit(0);
  });
}
