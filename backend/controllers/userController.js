const User = require('../models/User');
const Group = require('../models/Group');

exports.getUsers = async (req, res) => {
  const users = await User.find({}).populate('primaryGroup', 'name');
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
