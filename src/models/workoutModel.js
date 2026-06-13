import database from "../infra/database.js";

async function create(workoutInputValues) {
  const newWorkout = await runInsertQuery(workoutInputValues);
  return newWorkout;

  async function runInsertQuery(workoutInputValues) {
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
        workoutInputValues.name,
        workoutInputValues.muscle_group,
        workoutInputValues.user_id,
      ],
    });

    return result.rows[0];
  }
}

const workoutModel = {
  create,
};

export default workoutModel;
