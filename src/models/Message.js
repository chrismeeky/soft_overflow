import { model, Schema } from 'mongoose';

const messageSchema = Schema({
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  repliedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  message: {
    type: String,
    max: 50,
    min: 10,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Message', messageSchema);
