// server.js

require("dotenv").config();
const app = require("./app");
const rolePredictionQueue = require('./queue/rolePredictionQueue');
const rolePredictionProcess = require('./queue/job/rolePredictionProcess');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


rolePredictionQueue.process(rolePredictionProcess);

console.log('👷 Worker started and listening for role prediction jobs...');
