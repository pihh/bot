const inquirer = require("inquirer");
const authController = require("../../controllers/auth.controller");

module.exports = async function login() {
  const answers = await inquirer.prompt([
    {
      name: "username",
      message: "Please enter your username",
    },
    {
      name: "password",
      message: "Please enter your password",
    },
  ]);

  const username = answers.username.trim();
  const password = answers.password.trim();

  try {
    const user = await authController.login(username, password);
    return user;
  } catch (ex) {
    console.log("Invalid authentication", ex);
    return await login();
  }
}
