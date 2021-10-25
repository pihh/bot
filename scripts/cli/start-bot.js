const inquirer = require("inquirer");
const login = require('./login');

module.exports = async function startBot() {
  const user = await login();

  const projects = await user.user.getProjects();

  if (projects.length === 0) {
    console.log("You don't have any project, Please create a new project");
    return;
  }

  const projectList = projects.map((el) => `${el.id}: ${el.description}`);

  let answer = await inquirer.prompt([
    {
      type: "rawlist",
      name: "project",
      message: "What project do you want to put running",
      choices: projectList,
    },
  ]);
  answer = answer.project;
  console.log({ answer });
}
