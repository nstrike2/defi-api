const express = require('express');
const router = express.Router();
router.use("/lend", require("./lend"));
router.use("/stake", require("./stake"));
router.use("/exchange", require("./exchange"));
module.exports = router;
