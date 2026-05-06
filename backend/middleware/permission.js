const Log = require('../models/Log');

/**
 * Core Permission Checking Logic
 * @param {Object} user - The user requesting access
 * @param {Object} file - The file/folder being accessed
 * @param {String} operation - 'read', 'write', or 'execute'
 * @returns {Boolean} - Whether permission is granted
 */
const checkPermission = (user, file, operation) => {
  if (user.role === 'admin') return true; // Admins have root access

  const { owner, group, permissions } = file;
  const isOwner = owner.toString() === user._id.toString();
  const isInGroup = user.primaryGroup && group.toString() === user.primaryGroup.toString();

  // Permissions string format: rwxrwxrwx (9 chars)
  // Indices: 0-2 (Owner), 3-5 (Group), 6-8 (Others)
  let startIndex = 6; // Default to 'Others'
  if (isOwner) {
    startIndex = 0;
  } else if (isInGroup) {
    startIndex = 3;
  }

  const slice = permissions.substring(startIndex, startIndex + 3);
  
  switch (operation) {
    case 'read':
      return slice[0] === 'r';
    case 'write':
      return slice[1] === 'w';
    case 'execute':
      return slice[2] === 'x';
    case 'delete':
      // In Linux, deleting a file usually requires 'write' permission on the parent directory.
      // For this simulator, we'll check 'write' permission on the file itself or if owner.
      return isOwner || slice[1] === 'w';
    default:
      return false;
  }
};

/**
 * Middleware to check permissions for a specific file operation
 * @param {String} operation - 'read', 'write', 'execute', or 'delete'
 */
const authorizeFile = (operation) => {
  return async (req, res, next) => {
    try {
      const file = req.fileData; // Assumes file was fetched in a previous middleware/route
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      const isAllowed = checkPermission(req.user, file, operation);

      // Log the attempt
      await Log.create({
        user: req.user._id,
        username: req.user.username,
        action: `${operation}_file`,
        target: file.name,
        status: isAllowed ? 'success' : 'denied',
        details: isAllowed ? 'Access granted' : 'Access denied by permission engine'
      });

      if (!isAllowed) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error in permission check', error: error.message });
    }
  };
};

// Helper to convert numeric (755) to symbolic (rwxr-xr-x)
const numericToSymbolic = (num) => {
  const mapping = {
    '7': 'rwx', '6': 'rw-', '5': 'r-x', '4': 'r--',
    '3': '-wx', '2': '-w-', '1': '--x', '0': '---'
  };
  return num.split('').map(digit => mapping[digit] || '---').join('');
};

// Helper to convert symbolic to numeric
const symbolicToNumeric = (sym) => {
  const sliceToNum = (slice) => {
    let n = 0;
    if (slice[0] === 'r') n += 4;
    if (slice[1] === 'w') n += 2;
    if (slice[2] === 'x') n += 1;
    return n;
  };
  return `${sliceToNum(sym.substring(0, 3))}${sliceToNum(sym.substring(3, 6))}${sliceToNum(sym.substring(6, 9))}`;
};

module.exports = {
  checkPermission,
  authorizeFile,
  numericToSymbolic,
  symbolicToNumeric
};
