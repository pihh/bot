const { DB_NAME } = require("./environment.config");

module.exports = {
  dialect: "sqlite",
  storage: `./${DB_NAME}.sqlite`,
};
