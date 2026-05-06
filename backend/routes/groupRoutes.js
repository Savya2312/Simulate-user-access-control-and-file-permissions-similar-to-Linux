const express = require('express');
const router = express.Router();
const { getGroups, createGroup, addUserToGroup } = require('../controllers/groupController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getGroups);
router.post('/', protect, admin, createGroup);
router.post('/add-user', protect, admin, addUserToGroup);

module.exports = router;
