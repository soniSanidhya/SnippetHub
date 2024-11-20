import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        index : true,
        unique : true
    }
});

export const Category = mongoose.model('Category' , categorySchema);