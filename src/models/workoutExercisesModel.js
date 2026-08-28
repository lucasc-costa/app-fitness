import database from "../infra/database.js";
import { NotFoundError, ValidationError } from "../infra/error.js";

async function create(workoutExercisesInputValues) {
  const lastSequence = await getNextSequence(
    workoutExercisesInputValues.workoutId
  );

  const nextSequence = lastSequence ? lastSequence + 1 : 1;
  const newWorkoutExercises = await runInsertQuery(
    workoutExercisesInputValues.exercise_id,
    workoutExercisesInputValues.workoutId,
    nextSequence,
    workoutExercisesInputValues.sets,
    workoutExercisesInputValues.reps,
    workoutExercisesInputValues.weight ?? null,
    workoutExercisesInputValues.observations ?? null,
    workoutExercisesInputValues.video_url ?? null
  );

  return newWorkoutExercises;

  async function runInsertQuery(
    exercise_id,
    workout_id,
    sequence,
    sets,
    reps,
    weight,
    observations,
    video_url
  ) {
    const result = await database.query({
      text: `
                INSERT INTO
                    workout_exercises(exercise_id, workout_id, sequence, sets, reps, weight, observations, video_url)
                VALUES
                    ($1,$2,$3,$4,$5,$6,$7,$8) 
                RETURNING
                     id, exercise_id, workout_id, sequence, sets, reps, weight, observations, video_url
            ;`,
      values: [
        exercise_id,
        workout_id,
        sequence,
        sets,
        reps,
        weight,
        observations,
        video_url,
      ],
    });

    return result.rows[0];
  }
}

async function findByWorkoutId(workoutId) {
  const workoutExercisesFound = await runSelectQuery(workoutId);

  return workoutExercisesFound;

  async function runSelectQuery(workoutId) {
    const result = await database.query({
      text: `
        SELECT 
          w.id,
          w.exercise_id,
          e.name AS exercise_name,
          e.muscle_group,
          w.sequence,
          w.sets,
          w.reps,
          w.weight,
          w.observations,
          w.video_url
        FROM
          workout_exercises w
        INNER JOIN  exercises e
          ON w.exercise_id = e.id
        WHERE
          w.workout_id = ($1)
        ORDER BY
          w.sequence;
      ;`,
      values: [workoutId],
    });
    return result.rows;
  }
}

async function findOneById(workoutExerciseId, workoutId) {
  const workoutExercisesFound = await runSelectQuery(
    workoutExerciseId,
    workoutId
  );

  return workoutExercisesFound;

  async function runSelectQuery(workoutExerciseId, workoutId) {
    const result = await database.query({
      text: `
        SELECT 
          id,
          exercise_id,
          sequence,
          sets,
          reps,
          weight,
          observations,
          video_url
        FROM
          workout_exercises
        WHERE
          id = ($1)
        AND
          workout_id = ($2)
      ;`,
      values: [workoutExerciseId, workoutId],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O Treino informado não foi encontrado",
        action: "Verifique se o Id esta digitado corretamente.",
      });
    }
    return result.rows[0];
  }
}

async function update(
  workoutExercisesInputValues,
  workoutExerciseId,
  workoutId
) {
  const currentWorkoutExercise = await findOneById(
    workoutExerciseId,
    workoutId
  );

  const workoutExerciseWithNewValues = {
    ...currentWorkoutExercise,
    ...workoutExercisesInputValues,
  };

  const updateWorkoutExersise = await runUpdateQuery(
    workoutExerciseWithNewValues,
    workoutId
  );

  return updateWorkoutExersise;

  async function runUpdateQuery(workoutExercisesInputValues, workoutId) {
    const result = await database.query({
      text: `
          UPDATE
            workout_exercises
          SET
            sets = ($1),
            reps = ($2),
            weight = ($3),
            observations = ($4),
            video_url = ($5)
          WHERE
            id= ($6)
          AND
            workout_id = ($7)
          RETURNING
            id, sets, reps, weight,observations,video_url
        ;`,
      values: [
        workoutExercisesInputValues.sets,
        workoutExercisesInputValues.reps,
        workoutExercisesInputValues.weight,
        workoutExercisesInputValues.observations,
        workoutExercisesInputValues.video_url,
        workoutExercisesInputValues.id,
        workoutId,
      ],
    });

    return result.rows[0];
  }
}

async function deleteWorkoutExercise(workoutExerciseId, workoutId) {
  const deletedWorkoutExercise = await runDeleteQuery(
    workoutExerciseId,
    workoutId
  );
  if (!deletedWorkoutExercise) {
    throw new NotFoundError({
      message: "O exercicio informado não foi encontrado",
      action: "Verifique se o Id esta digitado corretamente.",
    });
  }
  await reorganizeSequence(workoutId, deletedWorkoutExercise.sequence);

  return deletedWorkoutExercise;

  async function runDeleteQuery(workoutExerciseId, workoutId) {
    const result = await database.query({
      text: `
          DELETE FROM
            workout_exercises
          WHERE
            id= ($1)
          AND
            workout_id = ($2)
          RETURNING
            id, sequence,sets, reps, weight,observations,video_url
        ;`,
      values: [workoutExerciseId, workoutId],
    });

    return result.rows[0];
  }
}

async function reorganizeSequence(workoutId, oldSequence) {
  const updateSequence = await runUpdateQuery(workoutId, oldSequence);

  return updateSequence;

  async function runUpdateQuery(workoutId, oldSequence) {
    await database.query({
      text: `
          UPDATE 
            workout_exercises
          SET 
            sequence = sequence - 1
          WHERE
            workout_id = ($1)
          AND
            sequence > ($2);
        ;`,
      values: [workoutId, oldSequence],
    });
  }
}

async function reorder(workoutExercisesInputValues, workoutId) {
  const currentWorkoutExercises = await findByWorkoutId(workoutId);
  const currentIds = currentWorkoutExercises.map(
    (workoutExercice) => workoutExercice.id
  );
  const newIds = workoutExercisesInputValues.map(
    (workoutExercice) => workoutExercice.workout_exercise_id
  );
  if (currentWorkoutExercises.length !== workoutExercisesInputValues.length) {
    throw new NotFoundError({
      message: `Quantidade de treino incorreta`,
      action: "Verifique se o Id esta digitado corretamente.",
    });
  }

  newIds.forEach((id) => {
    if (!currentIds.includes(id)) {
      throw new ValidationError({
        message: `O Treino ${id} não foi encontrado`,
        action: "Verifique se o Id esta digitado corretamente.",
      });
    }
  });

  await Promise.all(
    workoutExercisesInputValues.map(async (workoutExercises) => {
      await runUpdateQuery(workoutExercises, workoutId);
    })
  );

  async function runUpdateQuery(workoutExercisesInputValues, workoutId) {
    await database.query({
      text: `
          UPDATE
            workout_exercises
          SET
            sequence = ($1) 
          WHERE
            id= ($2)
          AND
            workout_id = ($3)
        ;`,
      values: [
        workoutExercisesInputValues.sequence,
        workoutExercisesInputValues.workout_exercise_id,
        workoutId,
      ],
    });
  }
}

async function getNextSequence(workoutId) {
  const nextSequence = await runSelectQuery(workoutId);
  return nextSequence;

  async function runSelectQuery(workoutId) {
    const result = await database.query({
      text: `
          SELECT 
            MAX(sequence) AS next_sequence
          FROM
            workout_exercises
          WHERE
            workout_id = ($1)
        ;`,
      values: [workoutId],
    });

    return result.rows[0].next_sequence;
  }
}

const workoutExercisesModel = {
  create,
  findByWorkoutId,
  update,
  deleteWorkoutExercise,
  reorder,
};

export default workoutExercisesModel;
