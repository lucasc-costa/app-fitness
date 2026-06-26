import exercisesModel from "../models/exercisesModel.js";

async function createExercise(req, res) {
  const user_id = req.user.id;
  const exercises = {
    ...req.body,
    user_id,
  };
  const newExercises = await exercisesModel.create(exercises);

  return res
    .status(201)
    .json({ message: "Exercicio criado com sucesso", data: newExercises });
}

async function findAllExercises(req, res) {
  const filters = {
    user_id: req.user.id,
    muscle_group: req.query.muscle_group,
    name: req.query.name,
  };

  const exercisesFound = await exercisesModel.findAll(filters);
  return res.status(200).json({ data: exercisesFound });
}
async function findExerciseById(req, res) {
  const filters = {
    user_id: req.user.id,
    id: req.params.id,
  };

  const exerciseFound = await exercisesModel.findOneById(filters);
  return res.status(200).json({ data: exerciseFound });
}

async function updateExercise(req, res) {
  const filters = { ...req.body, ...req.params };

  filters["user_id"] = req.user.id;

  const updatedExercise = await exercisesModel.update(filters);
  return res.status(200).json({
    message: "Exercicio atualizado com sucesso",
    data: updatedExercise,
  });
}
async function deleteExercise(req, res) {
  const filters = { ...req.params };
  filters["user_id"] = req.user.id;

  const deleteExercise = await exercisesModel.deleteExercise(filters);
  return res.status(200).json({
    message: "Exercicio deletado com sucesso",
    data: deleteExercise,
  });
}

const exercises = {
  createExercise,
  findAllExercises,
  findExerciseById,
  updateExercise,
  deleteExercise,
};

export default exercises;
