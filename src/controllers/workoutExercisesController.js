import workoutModel from "../models/workoutModel.js";
import exercisesModel from "../models/exercisesModel.js";
import workoutExercisesModel from "../models/workoutExercisesModel.js";

async function createExercisesController(req, res) {
  const workoutId = req.params.workoutId;
  const exerciseId = req.body.exercise_id;
  const userId = req.user.id;

  const workoutExercise = {
    ...req.body,
    workoutId,
    userId,
  };

  await workoutModel.findById(workoutId, userId);
  await exercisesModel.findOneById({ id: exerciseId, user_id: userId });

  const newWorkoutExercise =
    await workoutExercisesModel.create(workoutExercise);

  return res.status(201).json({
    message: "Exercicio associado a treino com sucesso",
    data: newWorkoutExercise,
  });
}

async function findAllWorkoutExercises(req, res) {
  const workoutId = req.params.workoutId;
  const userId = req.user.id;

  await workoutModel.findById(workoutId, userId);

  const workoutExercisesFound =
    await workoutExercisesModel.findByWorkoutId(workoutId);

  return res.status(200).json({ data: workoutExercisesFound });
}

async function updateWorkoutExercises(req, res) {
  const workoutId = req.params.workoutId;
  const workoutExerciseId = req.params.workoutExerciseId;
  const userId = req.user.id;
  const workoutExercise = req.body;

  await workoutModel.findById(workoutId, userId);

  const updatedWorkoutExercise = await workoutExercisesModel.update(
    workoutExercise,
    workoutExerciseId,
    workoutId
  );

  return res.status(200).json({
    message: "Dados do exercício atualizados com sucesso.",
    data: updatedWorkoutExercise,
  });
}

async function reorderExercises(req, res) {
  const workoutId = req.params.workoutId;
  const userId = req.user.id;
  const items = req.body.items;

  await workoutModel.findById(workoutId, userId);

  await workoutExercisesModel.reorder(items, workoutId);

  return res.status(204).json();
}

async function deleteWorkoutExercises(req, res) {
  const workoutId = req.params.workoutId;
  const workoutExerciseId = req.params.workoutExerciseId;
  const userId = req.user.id;

  await workoutModel.findById(workoutId, userId);

  const deletedWorkoutExercise =
    await workoutExercisesModel.deleteWorkoutExercise(
      workoutExerciseId,
      workoutId
    );

  return res.status(200).json({
    message: "Exercício removido do treino com sucesso.",
    data: deletedWorkoutExercise,
  });
}

const workoutExercises = {
  createExercisesController,
  findAllWorkoutExercises,
  updateWorkoutExercises,
  deleteWorkoutExercises,
  reorderExercises,
};
export default workoutExercises;
