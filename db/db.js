import Sequelize from "sequelize";

const sequlize = new Sequelize("office-manage", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequlize;
