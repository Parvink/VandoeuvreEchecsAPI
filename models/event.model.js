import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  players: { type: [Schema.Types.ObjectId], ref: 'User' },
  description: { type: String },
  full: { type: Boolean, default: false }
});

export default eventSchema;
