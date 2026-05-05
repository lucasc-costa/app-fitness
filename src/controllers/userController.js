import userModel from "../models/userModel.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

async function createUser(req, res) {
  try {
    const sendUser = req.body;
    await validateUsername(sendUser.username);
    await validatePassword(sendUser.password);
    await validateEmail(sendUser.email);
    const newUser = await userModel.createUser(sendUser);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    await validateUsername(username);
    await validatePassword(password);
    const foundUser = await userModel.findOneByUsername(username);

    await comparePassword(password, foundUser.password);

    const token = await createToken(foundUser.id, foundUser.username);

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Usuário ou senha inválidos",
    });
  }
}

async function validatePassword(password) {
  if (typeof password === "undefined" || password.trim().length === 0) {
    throw new Error("A senha não foi informada.");
  }
}

async function validateUsername(username) {
  if (typeof username === "undefined" || username.trim().length === 0) {
    throw new Error("O username não foi informado.");
  }
}

async function validateEmail(email) {
  if (typeof email === "undefined" || email.trim().length === 0) {
    throw new Error("O email não foi informado.");
  }
}

async function comparePassword(sentPassword, foundPassword) {
  const isPasswordValid = await compare(sentPassword, foundPassword);

  if (!isPasswordValid) {
    throw new Error("O usuario ou email informado é invalido.");
  }
}

async function createToken(id, username) {
  const payload = {
    username,
    id,
  };

  const newToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return newToken;
}

const users = {
  createUser,
  loginUser,
};

export default users;
