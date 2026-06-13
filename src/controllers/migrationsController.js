import migrationsModel from "../models/migrationsModel.js";

async function getMigrations(req, res) {
  const pendingMigrations = await migrationsModel.listPendingMigrations();
  return res.status(200).json({
    message: "Migrations listada com sucesso",
    data: pendingMigrations,
  });
}
async function postMigrations(req, res) {
  const migratedMigrations = await migrationsModel.runPendingMigrations();

  if (migratedMigrations > 0) {
    return res.status(201).json({
      message: "Migrations rodadas com sucesso",
      data: migratedMigrations,
    });
  }

  return res.status(200).json({
    message: "Nenhuma migration pendente",
    data: migratedMigrations,
  });
}

const migrationsController = {
  getMigrations,
  postMigrations,
};

export default migrationsController;
