import { Schema, model } from 'mongoose';

const userSchema = Schema({
  firstName: {
    type: String,
    required: true,
    max: 20,
    min: 2,
  },
  lastName: {
    type: String,
    required: true,
    max: 20,
    min: 2,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  username: {
    type: String,
    required: true,
    max: 20,
    min: 3,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
  },
  hasProfile: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = model('User', userSchema);
