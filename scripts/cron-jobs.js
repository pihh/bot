var CronJob = require('cron').CronJob;

exports.cronActiveProjectsDaily = function(){
  var job = new CronJob('0 0 * * *', function() {
    console.log('Todo, cronjob for active projects close price daily');
  }, null, true, 'America/Los_Angeles');
  job.start();
}
