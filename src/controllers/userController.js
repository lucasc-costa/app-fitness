import userModel from "../models/userModel.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../infra/error.js";

async function createUser(req, res) {
  const sendUser = req.body;
  await validateUsername(sendUser.username);
  await validatePassword(sendUser.password);
  await validateEmail(sendUser.email);
  const newUser = await userModel.createUser(sendUser);
  return res
    .status(201)
    .json({ message: "Usuário criado com sucesso", data: newUser });
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    await validateUsername(username);
    await validatePassword(password);
    const foundUser = await findUserByUsername(username);

    await comparePassword(password, foundUser.password);

    const token = await createToken(foundUser.id, foundUser.username);

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token: token,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }
}

async function validatePassword(password) {
  if (typeof password === "undefined" || password.trim().length === 0) {
    throw new ValidationError({
      message: "A senha não foi informada.",
      action: "Verifique se este dado esta certo.",
    });
  }
}

async function validateUsername(username) {
  if (typeof username === "undefined" || username.trim().length === 0) {
    throw new ValidationError({
      message: "O username não foi informado.",
      action: "Verifique se este dado esta certo.",
    });
  }
}

async function validateEmail(email) {
  if (typeof email === "undefined" || email.trim().length === 0) {
    throw new ValidationError({
      message: "O email não foi informado.",
      action: "Verifique se este dado esta certo.",
    });
  }
}

async function comparePassword(sentPassword, foundPassword) {
  const isPasswordValid = await compare(sentPassword, foundPassword);

  if (!isPasswordValid) {
    throw new UnauthorizedError({
      message: "O usuario informado é invalido.",
      action: "Verifique se os dados enviados estão corretos.",
    });
  }
}

async function findUserByUsername(username) {
  let foundUser;
  try {
    foundUser = await userModel.findOneByUsername(username);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Usuario não confere.",
        action: "Verifique se este dado esta certo.",
      });
    }

    throw error;
  }

  return foundUser;
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
