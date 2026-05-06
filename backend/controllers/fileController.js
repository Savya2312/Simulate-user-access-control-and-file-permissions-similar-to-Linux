const File = require('../models/File');
const Log = require('../models/Log');
const { checkPermission, numericToSymbolic } = require('../middleware/permission');

// @desc    Get all files in a folder (or root)
// @route   GET /api/files
// @access  Private
exports.getFiles = async (req, res) => {
  const parentId = req.query.parent || null;
  try {
    const files = await File.find({ parent: parentId })
      .populate('owner', 'username')
      .populate('group', 'name');
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new file or folder
// @route   POST /api/files
// @access  Private
exports.createFile = async (req, res) => {
  const { name, type, parent, permissions, content } = req.body;

  try {
    const file = await File.create({
      name,
      type: type || 'file',
      owner: req.user._id,
      group: req.user.primaryGroup,
      permissions: permissions || 'rwxr-xr-x',
      content: content || '',
      parent: parent || null
    });

    await Log.create({
      user: req.user._id,
      username: req.user.username,
      action: 'create_file',
      target: name,
      status: 'success'
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get file by ID (with permission check)
// @route   GET /api/files/:id
// @access  Private
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('owner', 'username')
      .populate('group', 'name');
    
    if (!file) return res.status(404).json({ message: 'File not found' });

    const canRead = checkPermission(req.user, file, 'read');
    
    await Log.create({
      user: req.user._id,
      username: req.user.username,
      action: 'read_file',
      target: file.name,
      status: canRead ? 'success' : 'denied'
    });

    if (!canRead) return res.status(403).json({ message: 'Permission denied' });

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update file content or permissions
// @route   PUT /api/files/:id
// @access  Private
exports.updateFile = async (req, res) => {
  const { content, permissions, numericPermissions, name } = req.body;

  try {
    let file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Check write permission
    const canWrite = checkPermission(req.user, file, 'write');
    if (!canWrite) {
      await Log.create({
        user: req.user._id,
        username: req.user.username,
        action: 'write_file',
        target: file.name,
        status: 'denied'
      });
      return res.status(403).json({ message: 'Permission denied' });
    }

    if (content !== undefined) file.content = content;
    if (name !== undefined) file.name = name;
    
    if (permissions !== undefined) {
      file.permissions = permissions;
    } else if (numericPermissions !== undefined) {
      file.permissions = numericToSymbolic(numericPermissions);
    }

    const updatedFile = await file.save();

    await Log.create({
      user: req.user._id,
      username: req.user.username,
      action: 'update_file',
      target: file.name,
      status: 'success',
      details: permissions ? `Changed permissions to ${file.permissions}` : 'Updated content'
    });

    res.json(updatedFile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const canDelete = checkPermission(req.user, file, 'delete');
    if (!canDelete) {
      await Log.create({
        user: req.user._id,
        username: req.user.username,
        action: 'delete_file',
        target: file.name,
        status: 'denied'
      });
      return res.status(403).json({ message: 'Permission denied' });
    }

    await file.deleteOne();

    await Log.create({
      user: req.user._id,
      username: req.user.username,
      action: 'delete_file',
      target: file.name,
      status: 'success'
    });

    res.json({ message: 'File removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
