const Group = require('../models/Group');
const User = require('../models/User');

exports.getGroups = async (req, res) => {
  const groups = await Group.find({}).populate('members', 'username');
  res.json(groups);
};

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const groupExists = await Group.findOne({ name });
  if (groupExists) return res.status(400).json({ message: 'Group already exists' });

  const group = await Group.create({
    name,
    createdBy: req.user._id
  });
  res.status(201).json(group);
};

exports.addUserToGroup = async (req, res) => {
  const { userId, groupId } = req.body;
  const group = await Group.findById(groupId);
  if (group) {
    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }
    res.json(group);
  } else {
    res.status(404).json({ message: 'Group not found' });
  }
};
