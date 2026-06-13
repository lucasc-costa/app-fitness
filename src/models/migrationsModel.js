import pkg from "node-pg-migrate";
import { resolve } from "node:path";
import database from "../infra/database.js";
import { ServiceError } from "../infra/error.js";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("src", "infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

const migrationRunner = pkg.default;

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return pendingMigrations;
  } catch (error) {
    throw new ServiceError({ cause: `${error}` });
  } finally {
    await dbClient?.end();
  }
}
async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    throw new ServiceError({ cause: `${error}` });
  } finally {
    await dbClient?.end();
  }
}

const migrationsModel = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrationsModel;
