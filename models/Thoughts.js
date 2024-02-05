const { Schema, model, default: mongoose } = require('mongoose');
const moment = require('moment');



const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: 'Text is required',
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // Add adjustable timestamp based on how long ago post was made (one second ago, ${minutes} ago, ${hours} ago, etc)
      get: thoughtTimestampFormat => moment(thoughtTimestampFormat).format("MMM DD, YYYY [at] hh:mm a")
    },
  },
);

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },

    reactionBody: {
      type: String,
      required: 'Reaction is required',
      minlength: 1,
      maxlength: 280,
    },

    username: {
      type: String,
      required: 'Username is required',
    },

    createdAt: {
      type: Date,
      default: Date.now,
      // Add adjustable timestamp based on how long ago a reaction was posted (${seconds} ago, ${minutes} ago, ${hours} ago, etc)
      get: thoughtTimestampFormat => moment(thoughtTimestampFormat).format("MMM DD, YYYY [at] hh:mm a"),
    }
  },

  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

thoughtsSchema.virtual('reactionTally').get(function () {
  return this.reactions.length;
});

const Thoughts = mongoose.model('Thoughts', thoughtsSchema);

module.exports = Thoughts;