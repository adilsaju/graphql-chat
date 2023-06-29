const mongoose = require('mongoose')

// Define Mongoose schemas
const roomSchema = new mongoose.Schema({
    room: {
      type: String,
      // required: true
    },
    employer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employer',
    },
    technician_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'technician',
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'job',
    },
    room_created: {
      type: Date,
      default: Date.now,
    },
  });
  
const messageSchema = new mongoose.Schema({
    id: {
      type: Date,
      required: true,
      default: Date.now,
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'room',
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'docModel',
    },
    docModel: {
      type: String,
      required: true,
      enum: ['employer', 'technician'],
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  });

module.exports = {
roomSchema,
messageSchema,
}