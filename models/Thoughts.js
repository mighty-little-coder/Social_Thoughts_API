const { Schema, model, default: mongoose } = require('mongoose');

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
      // Add adjustable timme stammp based on how lng ago post was made (one second ago, ${minutes} ago, ${hours} ago, etc)
      get: thoughtTimestampFormat => moment(thoughtTimestampFormat).format("MMM DD, YYYY [at] hh:mm a")
    },

    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reaction'
      }
    ]
  
  },

  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

const Thoughts = mongoose.model('Thoughts', thoughtsSchema);

module.exports = Thoughts;