import Sequelize from "sequelize";

const sequelize = new Sequelize(
  "office_manage",
  "office_user",
  "office123",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;