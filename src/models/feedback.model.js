import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema({

      name: {
        type: String,
        required: true,
        trim: true
      },
      patient_id:{
        type: String,
        required: true,
      },
      query_type_id:{
        type: String,
        default: null
      },
      email: {
        type: String,
        required: true,
        lowercase: true
      },
      age:{
        type:Number
      },
      mobile:{
        type:Number
      },
      message: {
        type: String,
        required: true
      },
      image:{
        type:String
      },
      is_reply: {
        type: String,
        enum: ['yes', 'no'],  // Enum restricts the role to these values
        default:'no'
      },
      message_reply_by_admin:{
        type: String,
        default:null
      },
      deleted_at:{
        type : Date, 
        default: null
      },
      is_deleted:{
        type:Boolean,
        default:false
      }

},{timestamps:true})





export const Feedback = mongoose.model("Feedback",feedbackSchema)