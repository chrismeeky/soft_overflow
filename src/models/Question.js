import { model, Schema } from 'mongoose';

const questionSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    required: true,
    min: 15,
    max: 100
  },
  description: {
    type: String,
    required: true,
    min: 20,
    max: 1000,
  },
  isSubScribed: {
    type: Boolean,
    default: true,
  },
  votes: {
    type: Array,
  },
  labels: {
    type: Array,
    max: 5,
    min: 1
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = model('Question', questionSchema);
