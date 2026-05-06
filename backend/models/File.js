const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    default: 'file'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  permissions: {
    type: String,
    default: 'rwxr-xr-x', // Default permissions
    validate: {
      validator: function(v) {
        return /^([r-][w-][x-]){3}$/.test(v);
      },
      message: props => `${props.value} is not a valid Linux permission string!`
    }
  },
  content: {
    type: String,
    default: ''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null // Root folder if null
  }
}, { timestamps: true });

module.exports = mongoose.model('File', FileSchema);
