import { model, Schema } from "mongoose";

const commentSchema = new Schema({
    snippet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snippet",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Comment = model("Comment", commentSchema);