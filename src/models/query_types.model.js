import mongoose, {Schema} from "mongoose";

const QueryTypesSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    is_deleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

export const QueryTypes = mongoose.model("query_type",QueryTypesSchema)