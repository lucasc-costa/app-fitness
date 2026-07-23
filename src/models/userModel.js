import database from "../infra/database.js";
import bcrypt from "bcrypt";
import { NotFoundError, ValidationError } from "../infra/error.js";

async function createUser(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);

  const hashedPassword = await bcrypt.hash(userInputValues.password, 10);

  const newUser = await runInsertQuery({
    ...userInputValues,
    password: hashedPassword,
  });

  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
          INSERT INTO 
            users (username,email,password) 
          VALUES 
            ($1, $2, $3)
          RETURNING
            id, username, email, created_at
          ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function findOneByUsername(username) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, password
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "O username informado não foi encontrado no sistema.",
      action: "Verifique se o username está digitado corretamente.",
    });
  }

  return results.rows[0];
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar esta operação.",
    });
  }
}
async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
    });
  }
}

const userModel = {
  createUser,
  findOneByUsername,
};

export default userModel;
