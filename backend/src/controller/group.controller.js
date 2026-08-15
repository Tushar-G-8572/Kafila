import Group from "../models/group.model.js";
import Rider from "../models/rider.model.js";
import { generateInviteCode } from "../utils/inviteCode.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const riderId = req.user.id; 

    const group = await Group.create({
      name,
      inviteCode: generateInviteCode(),
      members: [riderId],
      createdBy: riderId,
    });

    await Rider.findByIdAndUpdate(riderId, { $push: { groups: group._id } });
    res.status(201).json({message: "Group created successfully", group:{
     name: group.name,
     inviteCode: group.inviteCode,
     members: group.members,
    } });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const riderId = req.user.id;

    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(404).json({ message: "Invalid invite code" });

    if (!group.members.includes(riderId)) {
      group.members.push(riderId);
      await group.save();
      await Rider.findByIdAndUpdate(riderId, { $push: { groups: group._id } });
    }
    res.json({message: "Group joined successfully", group:{
     name: group.name,
     inviteCode: group.inviteCode,
     members: group.members,
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};