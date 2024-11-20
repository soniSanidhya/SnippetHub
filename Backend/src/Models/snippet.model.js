import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required : true,
  },
  title : {
    type : String,
    required : true
  },
  documentation : {
    type : String,
  },
  language : {
    type : String,
    required : true
  },
  tags : [
    {
      type : String
    }
  ],
  category : [{
    type : mongoose.Schema.ObjectId,
    ref : "Category"
  }],

  currentVersion : {
    type : mongoose.Schema.ObjectId,
    ref : "Version",
    required : true
  }, 
  

});

export const Snippet = mongoose.model("Snippet", snippetSchema);
