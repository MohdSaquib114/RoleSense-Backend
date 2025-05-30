const rolePredictionQueue = require("../../queue/rolePredictionQueue");
const {
  parseResumeFromBuffer,
  searchJobsWithPredictedRoles,
} = require("../../services/resume/resume");

const resumeUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const text = await parseResumeFromBuffer(req.file.buffer);

    const job = await rolePredictionQueue.add(
      {
        resumeText: text,
      },
      {
        removeOnFail: false,
      }
    );

    res.json({
      message: "Resume parsed and added to queue for LLM prediction",
      jobId: job.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse resume" });
  }
};

const getRolePredictionStatus = async (req, res) => {
  try {
    const job = await rolePredictionQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const state = await job.getState();

    if (state === "failed") {
      return res
        .status(500)
        .json({ status: "failed", error: job.failedReason });
    } else {
      return res.json({ status: state });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving job status" });
  }
};

const getPredictedRoleBasesJobs = async (req, res) => {
  try {
    const job = await rolePredictionQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const { predictedRoles } = job.returnvalue;
    const jobs = await searchJobsWithPredictedRoles(predictedRoles);

    return res.json({ jobs: jobs, predictedRoles: predictedRoles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving jobs" });
  }
};

const deleteJobFromQueue = async (req, res) => {
  try {
    const job = await rolePredictionQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    await job.remove();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  resumeUpload,
  getRolePredictionStatus,
  getPredictedRoleBasesJobs,
  deleteJobFromQueue,
};
