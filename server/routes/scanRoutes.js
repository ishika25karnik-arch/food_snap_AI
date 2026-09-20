const express = require('express');
const router = express.Router();
const { createScan, analyzeScan, getScanDetails } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createScan);
router.post('/:id/analyze', protect, analyzeScan);
router.get('/:id', protect, getScanDetails);

module.exports = router;
