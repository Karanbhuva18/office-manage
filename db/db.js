import Sequelize from "sequelize";

const sequelize = new Sequelize("office_manage", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
