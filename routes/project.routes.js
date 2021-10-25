const { authJwt } = require("../middleware");
const projects = require("../controllers/project.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/project/", [authJwt.verifyToken], projects.run);

}
