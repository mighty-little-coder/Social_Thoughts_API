const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    
    reactionBody: {
      type: String,
      required: 'Reaction is required',
      maxlength: 280
    },

    username: {
      type: String,
      required: 'Username is required'
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // Add adjustable time stamp based on how long ago a reaction was made (one second ago, ${minutes} ago, ${hours} ago, etc)
      get: thoughtTimestampFormat => moment(thoughtTimestampFormat).format("MMM DD, YYYY [at] hh:mm a")
    }
  },

  {
    toJSON: {
      getters: true
    },
    id: false
  }
);

const Reaction = model('Reaction', reactionSchema);

module.exports = Reaction;