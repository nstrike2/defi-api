const express = require('express');
const router = express.Router();
router.use('/rinkeby', require('./rinkeby'));
router.use('/kovan', require('./kovan'));
router.use('/goerli', require('./goerli'));
module.exports = router;