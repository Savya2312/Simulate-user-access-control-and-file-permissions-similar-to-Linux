const User = require('../models/User');
const Group = require('../models/Group');
const File = require('../models/File');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('Seeding default admin user...');
      
      // Ensure 'admin' group exists
      let adminGroup = await Group.findOne({ name: 'admin' });
      if (!adminGroup) {
        adminGroup = await Group.create({ name: 'admin' });
      }

      // Create root admin
      const rootUser = await User.create({
        username: 'root',
        password: 'root', // Will be hashed by pre-save hook
        role: 'admin',
        primaryGroup: adminGroup._id
      });

      // Add to group
      adminGroup.members.push(rootUser._id);
      adminGroup.createdBy = rootUser._id;
      await adminGroup.save();

      console.log('DEFAULT ADMIN CREATED');
      console.log('Username: root');
      console.log('Password: root');
      console.log('Role: admin');
      console.log('----------------------------------------');

      // Seed Demo Files
      console.log('Seeding demo files...');
      const demoFiles = [
        { name: 'etc', type: 'folder', permissions: 'rwxr-xr-x', owner: rootUser._id, group: adminGroup._id },
        { name: 'home', type: 'folder', permissions: 'rwxr-xr-x', owner: rootUser._id, group: adminGroup._id },
        { name: 'var', type: 'folder', permissions: 'rwxr-xr-x', owner: rootUser._id, group: adminGroup._id },
        { name: 'shadow', type: 'file', permissions: 'rw-------', owner: rootUser._id, group: adminGroup._id, content: 'root:$6$rounds=40000$local$shadow:19045:0:99999:7:::' },
        { name: 'welcome.txt', type: 'file', permissions: 'rw-r--r--', owner: rootUser._id, group: adminGroup._id, content: 'Welcome to the Linux Permission Simulator!\n\nThis system allows you to test rwx bits across users and groups.\nTry "chmod" to change permissions.' },
        { name: 'script.sh', type: 'file', permissions: 'rwxr-xr-x', owner: rootUser._id, group: adminGroup._id, content: '#!/bin/bash\necho "Execution granted"' },
      ];

      for (const f of demoFiles) {
        await File.create(f);
      }
      console.log('Demo files seeded.');
    } else {
      console.log('Admin user already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

module.exports = seedAdmin;
