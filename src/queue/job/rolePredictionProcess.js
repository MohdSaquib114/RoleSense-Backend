const RolePredictor = require("../../lib/ai/rolePredictor");

module.exports = async (job) => {
  const { resumeText } = job.data;
  const rolePredictor = new RolePredictor();
  const predictedRoles = await rolePredictor.predictRoles(resumeText);

  return { predictedRoles };
};
