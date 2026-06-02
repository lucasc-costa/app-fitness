import exercisesModel from "../models/exercisesModel.js";
import { validate } from "uuid";

async function createExercise(req, res) {
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

async function findAllExercises(req, res) {
  try {
    const allowedFilters = ["name", "muscle_group"];
    await validateAllowedFilters(req.query, allowedFilters);
    console.log();

    if (Object.keys(req.query).includes("name")) {
      await validateName(req.query.name);
    }
    if (Object.keys(req.query).includes("muscle_group")) {
      await validateMuscleGroup(req.query.muscle_group);
    }

    const filters = {
      user_id: req.user.id,
      muscle_group: req.query.muscle_group,
      name: req.query.name,
    };

    const exercisesFound = await exercisesModel.findAll(filters);
    return res.status(200).json(exercisesFound);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}
async function findExerciseById(req, res) {
  try {
    await validateId(req.params.id);

    const filters = {
      user_id: req.user.id,
      id: req.params.id,
    };

    const exerciseFound = await exercisesModel.findOneById(filters);
    return res.status(200).json(exerciseFound);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}

async function updateExercise(req, res) {
  try {
    const allowedFilters = ["name", "muscle_group"];
    await validateAllowedFilters(req.body, allowedFilters);
    if (Object.keys(req.body).includes("name")) {
      await validateName(req.body.name);
    }
    if (Object.keys(req.body).includes("muscle_group")) {
      await validateMuscleGroup(req.body.muscle_group);
    }

    await validateId(req.params.id);

    const filters = { ...req.body, ...req.params };

    filters["user_id"] = req.user.id;

    const updatedExercise = await exercisesModel.update(filters);
    return res.status(200).json(updatedExercise);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}
async function deleteExercise(req, res) {
  try {
    await validateId(req.params.id);

    const filters = { ...req.params };
    filters["user_id"] = req.user.id;

    const deleteExercise = await exercisesModel.deleteExercise(filters);
    return res.status(200).json(deleteExercise);
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

async function validateId(id) {
  if (!id || id.trim().length === 0) {
    throw new Error("O Id do exercicio não foi informado.");
  }
  if (!validate(id)) {
    throw new Error("O Id do exercicio informado esta incorreto.");
  }
}

async function validateAllowedFilters(input, allowedFilters) {
  if (Object.keys(input).length === 0) {
    throw new Error("Não foi informado nenhum parâmetro.");
  }
  for (let key in input) {
    if (!allowedFilters.includes(key)) {
      throw new Error(`Pârametro ${key} não é valido.`);
    }
  }
}

const exercises = {
  createExercise,
  findAllExercises,
  findExerciseById,
  updateExercise,
  deleteExercise,
};

export default exercises;
