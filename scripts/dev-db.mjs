import EmbeddedPostgres from "embedded-postgres";

const pg = new EmbeddedPostgres({
  databaseDir: "./.devdata/pgdata",
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

await pg.initialise();
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
