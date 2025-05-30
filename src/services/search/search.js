const client = require("../../db");

const searchJobs = async (keyword) => {
  const sanitizedKeyword = keyword.replace(/[^a-zA-Z0-9 ]/g, ""); // Prevent SQL injection

  const jobs = await client.$queryRaw`
  SELECT * FROM "Job"
  WHERE to_tsvector('english', job_title || ' ' || job_description || ' ' || company_name || ' ' || source)
  @@ plainto_tsquery('english', ${sanitizedKeyword})
  ORDER BY "createdAt" DESC
  LIMIT 20;
`;

  return jobs;
};

module.exports = {
  searchJobs,
};
