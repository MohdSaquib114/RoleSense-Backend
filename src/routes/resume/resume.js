 const express = require("express")
 const Router = express.Router()
 const multer = require("multer");
const { resumeUpload, getRolePredictionStatus, getPredictedRoleBasesJobs,deleteJobFromQueue } = require("../../controllers/resume/resume");


 const upload = multer({ storage: multer.memoryStorage() });

 Router.post("/upload",upload.single("resume"),resumeUpload)
 Router.get("/status/:jobId",getRolePredictionStatus)
 Router.get("/job/:jobId", getPredictedRoleBasesJobs)
 Router.delete("/job/:jobId", deleteJobFromQueue)

 module.exports = Router