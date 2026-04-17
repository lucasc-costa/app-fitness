import migrationsModel from "../models/migrationsModel.js";

async function getMigrations(req, res) {
  try {
    const pendingMigrations = await migrationsModel.listPendingMigrations();
    return res.status(200).json(pendingMigrations);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: "Não foi possivel listar as migrations" });
  }
}
async function postMigrations(req, res) {
  try {
    const migratedMigrations = await migrationsModel.runPendingMigrations();

    if (migratedMigrations > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ error: "Não foi possivel rodar as migrations" });
  }
}

const migrationsController = {
  getMigrations,
  postMigrations,
};

export default migrationsController;
