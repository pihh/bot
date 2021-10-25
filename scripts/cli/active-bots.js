const inquirer = require("inquirer");
const login = require('./login');

module.exports = async function activeBots(user) {
  if(!user){
    user = await login();
  }

  const projects = await user.user.getProjects({
    active: true,
  });

  console.log({bots:projects});
  return projects
}
