import { ValidationError } from "../infra/error.js";

function validateAllowedFields(location, fields) {
  return (req, res, next) => {
    const validLocations = ["body", "query", "params"];

    if (!validLocations.includes(location)) {
      throw new Error(`Invalid location: ${location}`);
    }

    const invalidFields = Object.keys(req[location]).filter(
      (field) => !fields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new ValidationError({
        message: `Campos invalidos: ${invalidFields.join(", ")}`,
        action: "Ajuste os dados enviados e tente novamente",
      });
    }

    next();
  };
}

export default validateAllowedFields;
