import { model, Schema } from 'mongoose';

const answerSchema = Schema({
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  repliedBY: { type: Schema.Types.ObjectId, ref: 'User' },
  response: {
    type: String,
    required: true,
    min: 15,
    text: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});
answerSchema.index({ response: 'text' });
module.exports = model('Answer', answerSchema);
