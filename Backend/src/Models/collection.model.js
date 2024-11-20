import { Schema } from "mongoose";

const collectionSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    snippets: [{
        type: Schema.Types.ObjectId,
        ref: "Snippet",
    }],
}, { timestamps: true });

export const Collection = model("Collection", collectionSchema);