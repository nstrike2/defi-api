const express = require('express');
const router = express.Router();
router.use("/lending", require("./lending"));
router.use("/staking", require("./staking"));
router.use("/exchanging", require("./exchanging"));
router.use("/yielding", require("./yielding"));
module.exports = router;
