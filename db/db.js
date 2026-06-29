import Sequelize from "sequelize";

const sequlize = new Sequlize("office-manage", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequlize;
