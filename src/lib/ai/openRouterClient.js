require("dotenv").config()
const { OpenAI } = require('openai');

const BASE_URL =  'https://openrouter.ai/api/v1'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, 
  baseURL:BASE_URL, 
});

module.exports = openai;
