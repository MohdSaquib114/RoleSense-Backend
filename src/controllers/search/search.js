const client = require("../../db");
const { searchJobs } = require("../../services/search/search");

const searchForJob = async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({
      message: "Keyword is not defined",
    });
  }

  try {
    const existingLog = await client.searchLog.findUnique({
      where: { keyword },
    });

    if (existingLog) {
      const updatedLog = await client.searchLog.update({
        where: { keyword },
        data: { count: existingLog.count + 1 },
      });
    } else {
      const newLog = await client.searchLog.create({
        data: {
          keyword,
          count: 1,
        },
      });
    }
    const jobs = await searchJobs(keyword);
    return res.status(201).json({ jobs: jobs, keyword: keyword });
  } catch (error) {
    console.error("Error logging keyword:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  searchForJob,
};
