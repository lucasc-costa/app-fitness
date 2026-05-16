import exercisesModel from "../models/exercisesModel.js";

async function createExercises(req, res) {
  try {
    await validateName(req.body.name);
    await validateMuscleGroup(req.body.muscle_group);
    const user_id = req.user.id;
    const exercises = {
      ...req.body,
      user_id,
    };
    const newExercises = await exercisesModel.create(exercises);

    return res.status(201).json(newExercises);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}

async function findAllExercices(req, res) {
  try {
    const filters = {
      user_id: req.user.id,
      muscle_group: req.query.muscle_group,
      name: req.query.name,
    };

    if (!filters.muscle_group && !filters.name) {
      throw new Error("Não foi informado filtros para a pesquisa.");
    }

    const exercisesFound = await exercisesModel.findAll(filters);
    return res.status(200).json(exercisesFound);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}

async function validateName(name) {
  if (typeof name === "undefined" || name.trim().length === 0) {
    throw new Error("O exercicio não foi informado.");
  }
}

async function validateMuscleGroup(muscleGroup) {
  if (typeof muscleGroup === "undefined" || muscleGroup.trim().length === 0) {
    throw new Error("O Grupo muscular não foi informado.");
  }
}

const exercises = {
  createExercises,
  findAllExercices,
};

export default exercises;
