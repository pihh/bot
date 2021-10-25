const config = require("../config/database.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  dialect: config.dialect,
  storage: config.storage,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.property = require("../models/property.model.js")(sequelize, Sequelize);
db.project = require("../models/project.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.project.belongsToMany(db.user, {
  through: "user_projects",
  foreignKey: "projectId",
  otherKey: "userId",
});

db.user.belongsToMany(db.project, {
  through: "user_projects",
  foreignKey: "userId",
  otherKey: "projectId",
});
db.ROLES = ["user", "admin"];

module.exports = db;
