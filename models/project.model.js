module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("projects", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ticker: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    money: {
      type:Sequelize.INTEGER,
      allowNull: false,
    },
    config: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    md5: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    results: {
      type: Sequelize.STRING,
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Project;
};
