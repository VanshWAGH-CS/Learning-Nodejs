const express = require("express");
const router = express.Router();
const {
  handleCreateNewUser,
  getUserById,
  handleGetAllUser,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");

// Route for all users
router
  .route("/")
  .get(handleGetAllUser)
  .post(handleCreateNewUser);

// Route for specific user by ID
router
  .route("/:id")
  .get(getUserById)
  .patch(handleUpdateUserById)
  .delete(handleDeleteUserById);

module.exports = router;
