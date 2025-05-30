const resumeRouter = require("./resume/resume")
const searchRouter = require("./search/search")
const express = require("express")

const router = express.Router()

router.use("/resume",resumeRouter)
router.use("/search",searchRouter)

module.exports = router