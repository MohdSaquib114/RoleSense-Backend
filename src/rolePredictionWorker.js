
const rolePredictionQueue = require('./queue/rolePredictionQueue');
const rolePredictionProcess = require('./queue/job/rolePredictionProcess');

rolePredictionQueue.process(rolePredictionProcess);

console.log('👷 Worker started and listening for role prediction jobs...');
