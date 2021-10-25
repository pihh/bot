const inquirer = require("inquirer");
const authController = require("../controllers/auth.controller");

async function login() {
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

exports.login = login;

async function startBot() {
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

exports.startBot = startBot;

async function stopBot() {
  console.log('todo this shit')

}

exports.stopBot = stopBot;



async function activeBots(user) {
  if(!user){
    user = await login();
  }

  const projects = await user.user.getProjects({
    active: true,
  });

  console.log({bots:projects});
  return projects
}

exports.activeBots = activeBots;
