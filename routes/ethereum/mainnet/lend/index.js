const express = require('express');
const router = express.Router();
router.use("/aave", require("./aave"));
router.use("/compound", require("./compound"));
router.post("/debug", console.log);
module.exports = router;
