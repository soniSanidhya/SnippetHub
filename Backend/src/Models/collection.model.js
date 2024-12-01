import { model, Schema } from "mongoose";

const collectionSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
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