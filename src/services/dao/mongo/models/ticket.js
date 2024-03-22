import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

const ticketModel = mongoose.model("Ticket", ticketSchema);

export { ticketModel }