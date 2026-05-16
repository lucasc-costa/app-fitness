import database from "../infra/database.js";

async function create(exercisesInputValues) {
  const newExercises = await runInsertQuery(exercisesInputValues);
  return newExercises;

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

    const result = await database.query({
      text: query,
      values: values,
    });

    return result.rows;
  }
}

const exercises = {
  create,
  findAll,
};

export default exercises;
