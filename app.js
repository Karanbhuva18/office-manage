import express from "express";
import sequlize from "./db/db.js";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

app.listen(5000, () => {
  sequlize.sync({ alter: true });
  console.log(`app start in port ${5000}`);
});
