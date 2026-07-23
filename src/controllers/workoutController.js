import { ForbiddenError, ValidationError } from "../infra/error.js";
import workoutModel from "../models/workoutModel.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 1 * 1000; // 1 days

async function createWorkout(req, res) {
  await validateExpiresAt(req.body.expires_at);
  const expiresAt = new Date(
    Date.now() + EXPIRATION_IN_MILLISECONDS * req.body.expires_at
  );
  const user_id = req.user.id;
  const workout = {
    ...req.body,
    expires_at: expiresAt,
    user_id,
  };

  const newWorkout = await workoutModel.create(workout);
  return res.status(201).json({
    message: "treino criado com sucesso",
    data: newWorkout,
  });
}

async function findAllWorkouts(req, res) {
  const user_id = req.user.id;
  const workoutsFound = await workoutModel.findAllByUserId(user_id);

  return res.status(200).json({ data: workoutsFound });
}

async function findWorkoutById(req, res) {
  const user_id = req.user.id;
  const id = req.params.id;
  const workoutFound = await workoutModel.findById(id);

  if (workoutFound.user_id !== user_id) {
    throw new ForbiddenError({
      message: "O treino informado pertence a outro usuário.",
      action: "Tente outro treino.",
    });
  }

  return res.status(200).json({ data: workoutFound });
}

async function updateWorkout(req, res) {
  const user_id = req.user.id;
  const date = req.body.expires_at;
  const name = req.body.name;
  validateExpiresAt(date);

  const workout = {
    ...req.params,
    name,
    user_id,
  };

  if (!(req.body.expires_at === undefined)) {
    const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS * date);
    workout["expires_at"] = expiresAt;
    console.log(expiresAt);
  }

  const updatedWorkout = await workoutModel.update(workout);
  return res.status(200).json({
    message: "Treino atualizado com sucesso",
    data: updatedWorkout,
  });
}

async function deleteWorkout(req, res) {
  const user_id = req.user.id;
  const id = req.params.id;
  const deletedWorkout = await workoutModel.deleteWorkout({ id, user_id });

  return res.status(200).json({
    message: "Treino removido com sucesso.",
    data: deletedWorkout,
  });
}

async function validateExpiresAt(time) {
  if (!Number.isInteger(time)) {
    throw new ValidationError({
      message: `Campo invalido: expires_at`,
      action: "Ajuste os dados enviados e tente novamente",
    });
  }
}

const workoutController = {
  createWorkout,
  findAllWorkouts,
  findWorkoutById,
  updateWorkout,
  deleteWorkout,
};

export default workoutController;
