import { ValidationError } from "../infra/error.js";
import { validate } from "uuid";

async function validateId(req, res, next) {
  const id = req.params.id;

  if (!id || id.trim().length === 0) {
    throw new ValidationError({
      message: "O Id não foi informado.",
      action: "Informe o ID.",
    });
  }
  if (!validate(id)) {
    throw new ValidationError({
      message: "O Id informado esta incorreto.",
      action: "Informe um Id valido.",
    });
  }

  next();
}

export default validateId;
