const login = require('./cli/login');
const startBot = require('./cli/start-bot');
const stopBot = require('./cli/stop-bot');
const activeBots = require('./cli/active-bots');

exports.login = login;
exports.startBot = startBot;
exports.stopBot = stopBot;
exports.activeBots = activeBots;
