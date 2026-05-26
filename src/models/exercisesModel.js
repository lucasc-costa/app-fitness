import database from "../infra/database.js";

async function create(exercisesInputValues) {
  const newExercise = await runInsertQuery(exercisesInputValues);
  return newExercise;

  async function runInsertQuery(exercisesInputValues) {
    const result = await database.query({
      text: `
            INSERT INTO
                exercises(name, muscle_group, created_by_user_id)
            VALUES
                ($1,$2,$3)
            RETURNING
                id, name, muscle_group, created_by_user_id
        ;`,
      values: [
        exercisesInputValues.name,
        exercisesInputValues.muscle_group,
        exercisesInputValues.user_id,
      ],
    });

    return result.rows[0];
  }
}

async function findAll(filters) {
  const exercisesFound = await runSelectQuery(filters);
  if (exercisesFound.length === 0) {
    throw new Error("Exercicio não encontrado.");
  }
  return exercisesFound;

  async function runSelectQuery(filters) {
    let query = `
            SELECT
                id, name, muscle_group, created_by_user_id
            FROM
              exercises
            WHERE
            (
            created_by_user_id = ($1)
              OR
            created_by_user_id IS NULL
            )
        `;
    let numberVarible = 1;
    let values = [filters.user_id];

    if (filters.muscle_group) {
      numberVarible += 1;
      values.push(filters.muscle_group);
      query = query + `AND LOWER(muscle_group) LIKE LOWER($${numberVarible})`;
    }
    if (filters.name) {
      numberVarible += 1;
      values.push(`%${filters.name}%`);
      query = query + ` AND LOWER(name) LIKE LOWER($${numberVarible})`;
    }
    if (filters.id) {
      numberVarible += 1;
      values.push(`${filters.id}`);
      query = query + ` AND id = ($${numberVarible})`;
    }

    const result = await database.query({
      text: query,
      values: values,
    });

    return result.rows;
  }
}

async function update(exerciseInputValues) {
  await validateId(exerciseInputValues.id);

  const filters = {
    id: exerciseInputValues.id,
    user_id: exerciseInputValues.user_id,
  };
  const currentExercise = await findAll(filters);

  if (
    !(currentExercise[0].created_by_user_id === exerciseInputValues.user_id)
  ) {
    throw new Error("Exercicio não pode ser alterado.");
  }

  const exerciseWithNewValues = {
    ...currentExercise[0],
    ...exerciseInputValues,
  };

  const updateExercise = await runUpdateQuery(exerciseWithNewValues);
  return updateExercise;

  async function runUpdateQuery(exercisesInputValues) {
    const result = await database.query({
      text: `
            UPDATE
                exercises
            SET
              name = ($2),
              muscle_group = ($3)
            WHERE
                id = ($1)
            AND
                created_by_user_id = ($4)
            RETURNING
                id, name, muscle_group, created_by_user_id
        ;`,
      values: [
        exerciseInputValues.id,
        exercisesInputValues.name,
        exercisesInputValues.muscle_group,
        exercisesInputValues.user_id,
      ],
    });

    return result.rows[0];
  }
}

async function deleteExercise(exerciseInputValues) {
  await validateId(exerciseInputValues.id);
  const currentExercise = await findAll(exerciseInputValues);

  if (
    !(currentExercise[0].created_by_user_id === exerciseInputValues.user_id)
  ) {
    throw new Error("Exercicio não pode ser excluido.");
  }

  const deleteExercise = await runDeleteQuery(exerciseInputValues);
  return deleteExercise;

  async function runDeleteQuery(exercisesInputValues) {
    const result = await database.query({
      text: `
            DELETE FROM
                exercises
            WHERE
                id = ($1)
            AND
                created_by_user_id = ($2)
            RETURNING
                id, name, muscle_group, created_by_user_id
        ;`,
      values: [exerciseInputValues.id, exercisesInputValues.user_id],
    });

    return result.rows[0];
  }
}

async function validateId(id) {
  const results = await database.query({
    text: `
      SELECT
        id
      FROM
        exercises
      WHERE
        id = ($1)
      LIMIT
        1
      ;`,
    values: [id],
  });

  if (results.rowCount === 0) {
    throw new Error("O Id informado não existe.");
  }
}

const exercises = {
  create,
  findAll,
  update,
  deleteExercise,
};

export default exercises;
