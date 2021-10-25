const { spawn } = require("child_process");

exports.run = (req, res) => {

  // spawn new child process to call the python script
  const python = spawn("python", ["./projects/json-data.py"]);

  let dataToSend = {}

  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data
  });
  // in close event we are sure that stream is from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.status(200).send({code, data:JSON.parse(dataToSend)});
  });
};
