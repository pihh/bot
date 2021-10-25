require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const config = require("../config/auth.config");
const {TOKEN_EXPIRES} = require('../config/environment.config');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

exports.login = async(username,password)=>{
  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw { message: "User Not found." };
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    throw {
      accessToken: null,
      message: "Invalid Password!",
    }
  }

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: TOKEN_EXPIRES, // 10 y
  });

  const authorities = [];
  const roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    authorities.push("ROLE_" + roles[i].name.toUpperCase());
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: authorities,
    accessToken: token,
    user:user
  }
}

exports.signup = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    if (req.body.roles) {
      const roles = Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      await user.setRoles(roles);
      res.send({ message: "User registered successfully!" });
    } else {
      await user.setRoles([1]);
      res.send({ message: "User registered successfully!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {

  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: TOKEN_EXPIRES, // 10 y
    });

    const authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
