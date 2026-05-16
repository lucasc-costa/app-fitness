exports.up = (pgm) => {
  pgm.createTable("exercises", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    muscle_group: {
      type: "varchar(100)",
      notNull: true,
    },
    created_by_user_id: {
      type: "uuid",
      notNull: false,
      references: '"users"',
      onDelete: "CASCADE",
    },
  });
};

exports.down = false;
