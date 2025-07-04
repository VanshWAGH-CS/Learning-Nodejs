const User = require("../models/user");

async function handleGetAllUser(req, res) {
  const users = await User.find({});
  return res.json(users);
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
}

async function handleCreateNewUser(req, res) {
  const { firstName, lastName, email, gender, jobTitle } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: "First name and email are required" });
  }

  try {
    const newUser = await User.create({ firstName, lastName, email, gender, jobTitle });
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleUpdateUserById(req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: "Invalid update request" });
  }
}

async function handleDeleteUserById(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted", user: deletedUser });
  } catch (err) {
    res.status(400).json({ error: "Invalid delete request" });
  }
}

module.exports = {
  handleGetAllUser,
  getUserById,
  handleCreateNewUser,
  handleUpdateUserById,
  handleDeleteUserById,
};
