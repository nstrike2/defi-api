const express = require('express');
const router = express.Router();
router.use('/compound', require('./compound'))
module.exports = router;