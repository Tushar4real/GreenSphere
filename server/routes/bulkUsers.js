const express = require('express');
const router = express.Router();
const bulkUserController = require('../controllers/bulkUserController');
const { auth, requireRole } = require('../middlewares/auth');

// Bulk import users
router.post('/import', auth, requireRole(['admin']), bulkUserController.bulkImportUsers);

// Export users
router.get('/export', auth, requireRole(['admin']), bulkUserController.exportUsers);

// Bulk update users
router.put('/update', auth, requireRole(['admin']), bulkUserController.bulkUpdateUsers);

// Bulk delete users
router.delete('/delete', auth, requireRole(['admin']), bulkUserController.bulkDeleteUsers);

module.exports = router;