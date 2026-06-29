import Sequelize from "sequelize";

const sequlize = new Sequlize("office_manage", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequlize;
