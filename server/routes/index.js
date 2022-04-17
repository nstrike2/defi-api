const express = require('express');
const router = express.Router();
router.use('/ethereum', require('./ethereum'));
module.exports = router;