import { ValidationError } from "../infra/error.js";
import { validate } from "uuid";

async function validateId(req, res, next) {
  const ids = req.params;

  for (const [key, value] of Object.entries(ids)) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError({
        message: `O ${key} não foi informado.`,
        action: "Informe o ID.",
      });
    }
    if (!validate(value)) {
      throw new ValidationError({
        message: `O ${key} informado esta incorreto.`,
        action: "Informe um Id valido.",
      });
    }
  }
  next();
}

export default validateId;
