import { ValidationError } from "../infra/error.js";
import { validate } from "uuid";

function validateReorderWorkoutExercises(fields) {
  return (req, res, next) => {
    const valueInput = req.body.items;

    if (!valueInput || !Array.isArray(valueInput) || valueInput.length === 0) {
      throw new ValidationError({
        message: `Campos não enviados`,
        action: "Ajuste os dados enviados e tente novamente",
      });
    }

    valueInput.forEach((index) => {
      requireFields(fields, index);
      validateAllowedFields(fields, index);
      validateEmptyFields(fields, index);
    });
    validateSequence(valueInput);

    next();
  };
}

function requireFields(fields, index) {
  const missingFields = fields.filter((field) => !(field in (index ?? {})));

  if (missingFields.length > 0) {
    throw new ValidationError({
      message: `Campos obrigatórios: ${missingFields.join(", ")}`,
      action: "Ajuste os dados enviados e tente novamente",
    });
  }
}

function validateAllowedFields(fields, index) {
  const invalidFields = Object.keys(index).filter(
    (field) => !fields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new ValidationError({
      message: `Campos invalidos: ${invalidFields.join(", ")}`,
      action: "Ajuste os dados enviados e tente novamente",
    });
  }
}

function validateEmptyFields(fields, index) {
  const emptyFields = [];
  fields.forEach((field) => {
    const value = index[field];

    if (
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      !value
    ) {
      emptyFields.push(field);
    }
  });

  if (emptyFields.length > 0) {
    throw new ValidationError({
      message: `Campos informados vazios: ${emptyFields.join(", ")}`,
      action: "Ajuste os dados enviados e tente novamente",
    });
  }
}

function validateSequence(array) {
  const revisedWorkoutExercises = new Set();
  const revisedSequence = new Set();

  for (const item of array) {
    if (
      revisedWorkoutExercises.has(item.workout_exercise_id) ||
      revisedSequence.has(item.sequence)
    ) {
      throw new ValidationError({
        message: `Campo duplicado`,
        action: "Ajuste os dados enviados e tente novamente",
      });
    }

    if (
      !Number.isInteger(item.sequence) ||
      !validate(item.workout_exercise_id)
    ) {
      throw new ValidationError({
        message: `Valor incorreto no item ${item.sequence}`,
        action: "Ajuste os dados enviados e tente novamente",
      });
    }

    revisedWorkoutExercises.add(item.workout_exercise_id);
    revisedSequence.add(item.sequence);
  }

  if (
    Math.max(...revisedSequence) !== array.length ||
    Math.min(...revisedSequence) <= 0
  ) {
    throw new ValidationError({
      message: `Sequência inválida`,
      action: "Ajuste os dados enviados e tente novamente",
    });
  }
}

export default validateReorderWorkoutExercises;
