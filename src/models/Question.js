import { model, Schema } from 'mongoose';

const questionSchema = Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    required: true,
    min: 15,
    max: 100,
    text: true
  },
  description: {
    type: String,
    required: true,
    min: 20,
    max: 1000,
    text: true,
  },
  isSubscribed: {
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
questionSchema.index({ title: 'text', description: 'text', labels: 'array' });
module.exports = model('Question', questionSchema);
