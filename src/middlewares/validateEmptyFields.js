import { ValidationError } from "../infra/error.js";

function validateEmptyFields(location, fields) {
  return (req, res, next) => {
    const validLocations = ["body", "query", "params"];

    if (!validLocations.includes(location)) {
      throw new Error(`Invalid location: ${location}`);
    }

    const emptyFields = [];
    fields.forEach((field) => {
      const value = req[location][field];
      if (
        value === null ||
        (typeof value === "string" && value.trim() === "")
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

    next();
  };
}

export default validateEmptyFields;
