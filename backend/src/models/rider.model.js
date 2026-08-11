import mongoose from "mongoose";

const riderSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true, // Google ka "sub" claim — permanent unique identifier, email se better hai isliye
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String, // Google se mila image URL, seedha store kar lo
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  { timestamps: true } // createdAt / updatedAt auto mil jaayega
);

const riderModel =  mongoose.model("rider", riderSchema);

export default riderModel;