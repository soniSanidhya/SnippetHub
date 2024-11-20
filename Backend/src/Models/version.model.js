import { model, Schema } from "mongoose";

const versionSchema = new Schema(
  {
    snippet: {
      type: Schema.Types.ObjectId,
      ref: "Snippet",
    },
    version: {
      type: Number,
      required: true,
      lowercase: true,
    },
    updatedCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Version = model("Version", versionSchema);
