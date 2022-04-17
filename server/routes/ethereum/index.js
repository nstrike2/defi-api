const express = require('express');
const router = express.Router();
router.use('/rinkeby', require('./rinkeby'));
router.use('/kovan', require('./kovan'));
router.use('/goerli', require('./goerli'));
router.use('/mainnet', require('./mainnet'));
router.use('/axelnet', require('./axelnet'));
module.exports = router;
