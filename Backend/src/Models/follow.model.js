import { model, Schema } from "mongoose";

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
} , { timestamps: true });

export const Follow = model('Follow', followSchema);