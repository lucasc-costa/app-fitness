import { ValidationError } from "../infra/error.js";

function requireFields(location, fields) {
  return (req, res, next) => {
    const validLocations = ["body", "query", "params"];

    if (!validLocations.includes(location)) {
      throw new Error(`Invalid location: ${location}`);
    }

    const missingFields = fields.filter((field) => !(field in req[location]));

    if (missingFields.length > 0) {
      throw new ValidationError({
        message: `Campos obrigatórios: ${missingFields.join(", ")}`,
        action: "Ajuste os dados enviados e tente novamente",
      });
    }

    next();
  };
}

export default requireFields;
