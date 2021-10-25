require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { RESET_DATABASE } = require("./config/environment.config");
const cronJob = require('./scripts/cron-jobs');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./models");

if (RESET_DATABASE) {
  // force: true will drop the table if it already exists
  db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and Resync Database with { force: true }");
    initial();
  });
} else {
  db.sequelize.sync();
}

// simple route
app.get("/", (req, res) => {
  const { spawn } = require("child_process");
  // res.json({ message: "Express API is Ready" });
  let dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ["./projects/hello-world.py"]);
  // collect data from script

  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.status(200).send({code,dataToSend});
  });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/project.routes")(app);
require("./routes/property.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// start cron jobs
cronJob.cronActiveProjectsDaily()

async function initial() {
  const Role = db.role;
  const User = db.user;
  await Role.create({
    id: 1,
    name: "user",
  });

  await Role.create({
    id: 2,
    name: "admin",
  });

  const pihh = await User.create({
    username: "pihh",
    password: bcrypt.hashSync(process.env.PASSWORD,8),
    email: "filipemotasa@hotmail.com"
  });
  await pihh.setRoles([1,2]);
}

function describeModel() {
  const models = db;

  for (let model of Object.keys(models)) {
    if (models[model].name === "Sequelize") continue;
    if (!models[model].name) continue;

    console.log(
      "\n\n----------------------------------\n",
      models[model].name,
      "\n----------------------------------"
    );

    console.log("\nAssociations");
    for (let assoc of Object.keys(models[model].associations)) {
      for (let accessor of Object.keys(
        models[model].associations[assoc].accessors
      )) {
        console.log(
          models[model].name +
            "." +
            models[model].associations[assoc].accessors[accessor] +
            "()"
        );
      }
    }
  }
}

describeModel();
