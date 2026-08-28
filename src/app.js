import express from "express";
import userRoutes from "./routes/userRoutes.js";
import migrationsRoutes from "./routes/migrationsRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import workoutExercisesRoutes from "./routes/workoutExercisesRoutes.js";
import exercisesRoutes from "./routes/exercisesRoutes.js";
import database from "./infra/database.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.get("/", function (req, res) {
  res.send("Olá mundo!");
});
app.use(express.json());
app.use("/users", userRoutes);
app.use("/migrations", migrationsRoutes);
app.use("/workouts", workoutRoutes);
app.use("/workouts", workoutExercisesRoutes);
app.use("/exercises", exercisesRoutes);

app.use(errorHandler.onErrorHandler);
app.listen(process.env.PORT || 3000, async function () {
  console.log("Servidor iniciado!");
  const result = await database.query("SELECT 1+2 as sum;");
  console.log(result.rows);
});
