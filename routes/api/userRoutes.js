const router = require('express').Router();

// Import all of the API routes from /api/index.js
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// Set up GET all and POST at /api/users
router.route('/')
  .get(getUsers)
  .post(createUser);

// Set up GET one, PUT, and DELETE at /api/users/:id
router.route('/:userId')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Set up POST and DELETE at /api/users/:id/friends/:friendId
router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

module.exports = router;