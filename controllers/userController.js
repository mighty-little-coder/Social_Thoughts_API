const { Thoughts, User } = require('./../models');

module.exports = {

  // Get route for all users
  // http://localhost:3001/api/users
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get route for a single user
  // http://localhost:3001/api/users/:userId
  getUser: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate('friends')
        .populate('thoughts')
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user profile matches that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Post route to create a new user
  // http://localhost:3001/api/users
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Put route to update a user
  // http://localhost:3001/api/users/:userId
  updateUser: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Cannot update user because no user profile matches that ID' });
      }

      res.json(user);
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete route to remove a user
  // http://localhost:3001/api/users/:userId
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'Cannot delete user because no user profile matches that ID' });
      }

      await Thoughts.deleteMany({ username: user.username });

      const userName = user.username;

      res.json({ message: `${userName} and associated thoughts deleted` });
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

  // Put route to add a friend to a user
  // http://localhost:3001/api/users/:userId/friends/:friendId
  addFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Cannot add friend to user because no user profile matches that ID' });
      }

      res.json(user);
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete route to remove a friend from a user
  // http://localhost:3001/api/users/:userId/friends/:friendId
  removeFriend: async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Cannot remove friend from user because no user profile matches that ID' });
      }

      res.json(user);
    }
    catch (err) {
      res.status(500).json(err);
    }
  }
};