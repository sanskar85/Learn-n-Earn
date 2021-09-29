const express = require("express");
const router = express.Router();

router.use("/candidate", require("./CandidateAuth"));

router.use("/team", require("./TeamAuth"));

router.use("/manager", require("./ManagerAuth"));

module.exports = router;
