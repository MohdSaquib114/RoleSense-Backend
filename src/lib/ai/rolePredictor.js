const openai = require("./openRouterClient");

class RolePredictor {
  constructor() {
    this.model = "meta-llama/llama-4-scout:free";
    this.client = openai;
  }

  getSystemPrompt() {
    return `
You are an intelligent job role classification model. 
Your task is to analyze the resume content of a candidate and predict a set of job roles they are most qualified for.

You must:
- Understand the candidate's background, experience, and skills.
- Predict a list of job roles starting from broad/senior roles to more specific/junior ones.
- Include synonyms or variations that match real-world job titles.
- Consider the tools, frameworks, and domains mentioned in the resume (e.g., React, Python, Machine Learning, etc.).
- Tailor the output to reflect real-world hiring role names across companies and job boards.

You are expected to return only a well-structured JSON array of strings without any explanations or formatting.`;
  }

  getUserPrompt(resumeText) {
    return `
**Task**: Based on the following resume content, extract a list of relevant job roles the candidate is suitable for.

**Instructions**:
- Return a JSON array of job role titles (e.g., ["Software Engineer", "Frontend Developer", "React Developer"]).
- Start with broader/senior-level roles and proceed to more specific or junior-level ones.
- Include common variations and closely related titles (e.g., "Data Scientist", "ML Engineer", "AI Researcher").
- If someone has experience in frontend development, include roles like: "Frontend Developer", "React Developer", "JavaScript Developer", etc.
- If the candidate is in data science, include roles like: "Data Scientist", "Machine Learning Engineer", "AI Engineer", etc.
- Do NOT include any explanations, markdown, or extra text — just the raw JSON array like ["Role A", "Role B", "Role C"].
- If you’re unsure, make reasonable educated assumptions based on context.

**Resume Text**:
${resumeText}
    `.trim();
  }

  async predictRoles(resumeText) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: this.getSystemPrompt() },
        { role: "user", content: this.getUserPrompt(resumeText) },
      ],
    });

    const content = response.choices[0].message.content?.trim() || "[]";
    return JSON.parse(content);
  }
}

module.exports = RolePredictor;
