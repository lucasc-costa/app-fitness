import user from "../models/userModel.js";

async function createUser(req, res) {
  try {
    const newUser = await user.createUser(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
}

const users = {
  createUser,
};

export default users;
