const express = require('express');
const router = express.Router();
router.use("/lido", require("./lido"));
router.use("/rocket-pool", require("./rocket-pool"));
router.post("/debug", console.log);
module.exports = router;
