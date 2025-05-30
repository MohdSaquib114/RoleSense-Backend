 const express = require("express")
const { searchForJob } = require("../../controllers/search/search")
 const Router = express.Router()

  Router.post("/", searchForJob)

   module.exports = Router