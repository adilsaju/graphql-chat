const mongoose = require('mongoose')

const employerSchema = new mongoose.Schema({
   //  firebase_uid: String,
    name: {
       type: String,
       required: true
    },
    email: {
       type: String,
       required: true,
       unique: true,
       dropDups: true,
       index: true,
    },
    password: {
       type: String,
       required: true
    },
    picture: {
      type: String,
      default: "https://tekk-main.s3.us-west-2.amazonaws.com/1676798660245",
      required: true
   },
   phone: {
      type: String
   },
    id: {
      type: String,
      // required: true
   },
   dateJoined: {
      type: Date,
      default: Date.now
   },
   address: {
      type: String,
      default: `Vancouver, BC
       V5H 2K9`,
   },
 })

 employerSchema.index({ 'email' : 1 }, { unique: true });


 module.exports = {
   employerSchema,
   employerModel: mongoose.model('employer', employerSchema, 'employer'),
 }
 