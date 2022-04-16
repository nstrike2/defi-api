const express = require('express');
const router = express.Router();
router.use("/exchange", require("./exchange"));
router.post("/debug", console.log);
module.exports = router;
