import { ValidationError } from "../infra/error.js";
import exercisesModel from "../models/exercisesModel.js";
import { validate } from "uuid";

async function createExercise(req, res) {
  await validateName(req.body.name);
  await validateMuscleGroup(req.body.muscle_group);
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
  const allowedFilters = ["name", "muscle_group"];
  await validateAllowedFilters(req.query, allowedFilters);

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
  return res.status(200).json({ data: exercisesFound });
}
async function findExerciseById(req, res) {
  await validateId(req.params.id);

  const filters = {
    user_id: req.user.id,
    id: req.params.id,
  };

  const exerciseFound = await exercisesModel.findOneById(filters);
  return res.status(200).json({ data: exerciseFound });
}

async function updateExercise(req, res) {
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
  return res.status(200).json({
    message: "Exercicio atualizado com sucesso",
    data: updatedExercise,
  });
}
async function deleteExercise(req, res) {
  await validateId(req.params.id);

  const filters = { ...req.params };
  filters["user_id"] = req.user.id;

  const deleteExercise = await exercisesModel.deleteExercise(filters);
  return res.status(200).json({
    message: "Exercicio deletado com sucesso",
    data: deleteExercise,
  });
}

async function validateName(name) {
  if (typeof name === "undefined" || name.trim().length === 0) {
    throw new ValidationError({
      message: "O exercicio não foi informado.",
      action: "Informe o nome do exercicio.",
    });
  }
}

async function validateMuscleGroup(muscleGroup) {
  if (typeof muscleGroup === "undefined" || muscleGroup.trim().length === 0) {
    throw new ValidationError({
      message: "O Grupo muscular não foi informado.",
      action: "Informe o grupo muscular do exercicio.",
    });
  }
}

async function validateId(id) {
  if (!id || id.trim().length === 0) {
    throw new ValidationError({
      message: "O Id do exercicio não foi informado.",
      action: "Informe o ID do exercicio.",
    });
  }
  if (!validate(id)) {
    throw new ValidationError({
      message: "O Id do exercicio informado esta incorreto.",
      action: "Informe um Id valido.",
    });
  }
}

async function validateAllowedFilters(input, allowedFilters) {
  if (Object.keys(input).length === 0) {
    throw new ValidationError({
      message: "Não foi informado nenhum parâmetro.",
      action: "Informe os parametros do exercicio.",
    });
  }
  for (let key in input) {
    if (!allowedFilters.includes(key)) {
      throw new ValidationError({
        message: `Pârametro ${key} não é valido.`,
        action: "Informe os parametros validos.",
      });
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
