import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rider" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", required: true },
  },
  { timestamps: true }
);

const groupModel = mongoose.model("Group", groupSchema);
export default groupModel;