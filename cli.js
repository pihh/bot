const inquirer = require('inquirer');
const cli = require('./scripts/cli');


async function boot(){
  let answer = await inquirer
  .prompt([
    {
      type: 'rawlist',
      name: 'option',
      message: 'Hi, what do you want to do? Please choose one option.',
      choices: ['login', 'start bot', 'stop bot', 'active bots'],
    },
  ])
  answer = answer.option;
  if(answer === 'login'){
    await cli.login();
  }else if (answer === 'start bot'){
    await cli.startBot();
  }else if (answer === "stop bot"){
    await cli.stopBot()
  }else if(answer ==="active bots"){
    await cli.activeBots()
  }

}


boot();
