import database from "../infra/database.js";
import { ForbiddenError, NotFoundError } from "../infra/error.js";

async function create(workoutInputValues) {
  const newWorkout = await runInsertQuery(
    workoutInputValues.name,
    workoutInputValues.expires_at,
    workoutInputValues.user_id
  );
  return newWorkout;

  async function runInsertQuery(name, expires_at, user_id) {
    const result = await database.query({
      text: `
                INSERT INTO
                    workouts(name, expires_at, user_id)
                VALUES
                    ($1,$2,$3) 
                RETURNING
                     id, name, user_id, expires_at, created_at, updated_at
            ;`,
      values: [name, expires_at, user_id],
    });

    return result.rows[0];
  }
}

async function findAllByUserId(userId) {
  const workoutsFound = await runSelectQuery(userId);
  return workoutsFound;

  async function runSelectQuery(userId) {
    const result = await database.query({
      text: `
        SELECT 
          id, name, expires_at 
        FROM
          workouts
        WHERE
          user_id = ($1)
        ORDER BY 
          name
      ;`,
      values: [userId],
    });

    return result.rows;
  }
}

async function findById(id) {
  const workoutFound = await runSelectQuery(id);
  if (!workoutFound) {
    throw new NotFoundError({
      message: "O treino informado não foi encontrado",
      action: "Verifique se o Id esta digitado corretamente.",
    });
  }
  return workoutFound;

  async function runSelectQuery(id) {
    const result = await database.query({
      text: `
        SELECT 
          id, name, expires_at, user_id
        FROM
          workouts
        WHERE
          id = ($1)
      ;`,
      values: [id],
    });

    return result.rows[0];
  }
}

async function update(workoutInputValues) {
  const currentWorkout = await findById(workoutInputValues.id);
  if (!(currentWorkout.user_id === workoutInputValues.user_id)) {
    throw new ForbiddenError({
      message: "O treino informado não pode ser alterado.",
      action: "Tente outro treino.",
    });
  }
  const workoutWithNewValues = {
    ...currentWorkout,
    ...workoutInputValues,
  };

  const updateWorkout = await runUpdateQuery(workoutWithNewValues);
  return updateWorkout;

  async function runUpdateQuery(workoutInputValues) {
    const result = await database.query({
      text: `
        UPDATE
          workouts
        SET
          name = ($2),
          expires_at = ($3),
          updated_at = timezone('utc', now())
        WHERE
          id= ($1)
        AND
          user_id = ($4)
        RETURNING
          id, name, expires_at, user_id
      ;`,
      values: [
        workoutInputValues.id,
        workoutInputValues.name,
        workoutInputValues.expires_at,
        workoutInputValues.user_id,
      ],
    });
    return result.rows[0];
  }
}

async function deleteWorkout(workoutInputValues) {
  const currentWorkout = await findById(workoutInputValues.id);
  if (!(currentWorkout.user_id === workoutInputValues.user_id)) {
    throw new ForbiddenError({
      message: "O treino informado não pode ser alterado.",
      action: "Tente outro treino.",
    });
  }

  const deletedWorkout = await runDeleteQuery(workoutInputValues);
  return deletedWorkout;

  async function runDeleteQuery(workoutInputValues) {
    const result = await database.query({
      text: `
        DELETE FROM
          workouts
        WHERE
          id= ($1)
        AND
          user_id = ($2)
        RETURNING
          id, name, expires_at, user_id
      ;`,
      values: [workoutInputValues.id, workoutInputValues.user_id],
    });
    return result.rows[0];
  }
}

const workoutModel = {
  create,
  findAllByUserId,
  findById,
  update,
  deleteWorkout,
};

export default workoutModel;
