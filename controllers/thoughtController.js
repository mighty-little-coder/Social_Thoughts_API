const { Thoughts, User } = require('../models');

module.exports = {

  // Get route for all thoughts
  getThoughts: async (req, res) => {
    try {
      const thoughts = await Thoughts.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get route for a single thought
  getThought: async (req, res) => {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Post route to create a new thought and add it to the a user profile
  createThought: async (req, res) => {
    try {
      const thought = await Thoughts.create(req.body);
      const user = await
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      res.json({ message: `This thought was added to ${user.username}'s profile`, thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Put route to update a thought and update the user
  updateThought: async (req, res) => {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      const user = await User.findOneAndUpdate(
        { _id: thought.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete route to remove a thought and remove it from the user
  deleteThought: async (req, res) => {
    try {
      const thought = await Thoughts.findOneAndDelete({ _id: req.params.thoughtId });
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.json(thought);
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

  // Post route to add a reaction to a thought
  addReaction: async (req, res) => {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete route to remove a reaction from a thought
  deleteReaction: async (req, res) => {
    try {
      const thought = await Thoughts.findOneAndDelete(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};