const express = require('express');
const router = express.Router();
router.use("/exchange", require("./exchange"));
router.use("/lend", require("./lend"));
router.use("/stake", require("./stake"));
router.post("/debug", console.log);
module.exports = router;
