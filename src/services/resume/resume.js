const pdfParse = require("pdf-parse");
const client = require("../../db");

async function parseResumeFromBuffer(pdfBuffer) {
  try {
    const parsedData = await pdfParse(pdfBuffer);
    return parsedData.text;
  } catch (err) {
    throw new Error("Failed to parse resume PDF.");
  }
}

const searchJobsWithPredictedRoles = async (predictedRoles) => {
  if (!predictedRoles || predictedRoles.length === 0) return [];
  const safeRoles = predictedRoles.map((role) => role.replace(/'/g, "''"));
  const limit = 50;
  const conditions = safeRoles
    .map((role) => `job_title % '${role}'::text`)
    .join(" OR ");

  const similarityScores = safeRoles
    .map((role) => `similarity(job_title, '${role}'::text)`)
    .join(", ");

  const query = `
    SELECT *,
           GREATEST(${similarityScores}) AS score
    FROM "Job"
    WHERE ${conditions}
    ORDER BY score DESC
    
  `;

  try {
    const jobs = await client.$queryRawUnsafe(query);
    return jobs;
  } catch (err) {
    console.error("Error running trigram search:", err);
    return [];
  }
};

module.exports = {
  parseResumeFromBuffer,
  searchJobsWithPredictedRoles,
};
