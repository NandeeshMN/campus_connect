const express = require('express');
const router = express.Router();
const { login, logout, getDashboardStats, getAdminProfile } = require('../controllers/adminController');
const adminManagement = require('../controllers/adminManagementController');
const { adminAuthenticate } = require('../middleware/adminAuth');

// Public admin routes
router.post('/login', login);
router.post('/logout', logout);

// Protected admin routes
router.get('/me', adminAuthenticate, getAdminProfile);
router.get('/dashboard-stats', adminAuthenticate, getDashboardStats);

// --- User Management ---
router.get('/users', adminAuthenticate, adminManagement.getAllUsers);
router.patch('/users/:id/status', adminAuthenticate, adminManagement.updateUserStatus);

// --- Post Management ---
router.get('/posts', adminAuthenticate, adminManagement.getAllPosts);
router.patch('/posts/:id/visibility', adminAuthenticate, adminManagement.togglePostVisibility);

// --- Resource Management ---
router.get('/resources', adminAuthenticate, adminManagement.getAllResources);
router.post('/resources', adminAuthenticate, adminManagement.createResource);
router.delete('/resources/:id', adminAuthenticate, adminManagement.deleteResource);

// --- Announcements ---
router.get('/announcements', adminAuthenticate, adminManagement.getAnnouncements);
router.post('/announcements', adminAuthenticate, adminManagement.createAnnouncement);

// --- Reports ---
router.get('/reports', adminAuthenticate, adminManagement.getReports);
router.patch('/reports/:id/resolve', adminAuthenticate, adminManagement.resolveReport);

// --- Events Management ---
router.get('/events', adminAuthenticate, adminManagement.getAllEvents);
router.post('/events', adminAuthenticate, adminManagement.createEvent);
router.put('/events/:id', adminAuthenticate, adminManagement.updateEvent);
router.delete('/events/:id', adminAuthenticate, adminManagement.deleteEvent);

module.exports = router;

