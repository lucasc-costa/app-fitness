exports.up = (pgm) => {
  pgm.createTable("workout_exercises", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    exercise_id: {
      type: "uuid",
      notNull: true,
      references: '"exercises"',
      onDelete: "CASCADE",
    },
    workout_id: {
      type: "uuid",
      notNull: true,
      references: '"workouts"',
      onDelete: "CASCADE",
    },
    sequence: {
      type: "integer",
      notNull: false,
    },
    sets: {
      type: "integer",
      notNull: false,
    },
    reps: {
      type: "integer",
      notNull: false,
    },
    weight: {
      type: "numeric(5,2)",
      notNull: false,
    },
    observations: {
      type: "text",
      notNull: false,
    },
    video_url: {
      type: "varchar(255)",
      notNull: false,
    },
  });
};

exports.down = false;
