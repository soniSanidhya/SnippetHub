import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        index : true,
        unique : true
    }
});

export const Tag = mongoose.model('Tag' , tagSchema);