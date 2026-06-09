const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  getResources,
  getResourceById,
  incrementView,
  incrementDownload,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourcesController');

// Public (authenticated users)
router.get('/', authenticate, getResources);
router.get('/:id', authenticate, getResourceById);
router.post('/:id/view', authenticate, incrementView);
router.post('/:id/download', authenticate, incrementDownload);

// Admin only
router.post('/', authenticate, authorize(['admin']), createResource);
router.put('/:id', authenticate, authorize(['admin']), updateResource);
router.delete('/:id', authenticate, authorize(['admin']), deleteResource);

module.exports = router;
