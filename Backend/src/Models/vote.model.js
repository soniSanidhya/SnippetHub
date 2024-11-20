import { model, Schema } from "mongoose";

const voteSchema = new Schema({
    snippet: {
        type: Schema.Types.ObjectId,
        ref: "Snippet",
    },
    votedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    isUpVote: {
        type: Boolean,
        default: true,
    },
    comment : {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }
} , { timestamps: true });

export const Vote = model("Vote", voteSchema);