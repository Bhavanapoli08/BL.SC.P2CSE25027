const express = require('express');
const router = express.Router();
const { getItems, addItem } = require('../controllers/apiController');

router.get('/items', getItems);
router.post('/items', addItem);

module.exports = router;