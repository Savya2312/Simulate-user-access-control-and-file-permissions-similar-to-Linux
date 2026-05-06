const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
  const logs = await Log.find({}).sort({ timestamp: -1 }).limit(100);
  res.json(logs);
};

exports.clearLogs = async (req, res) => {
  await Log.deleteMany({});
  res.json({ message: 'Logs cleared' });
};
