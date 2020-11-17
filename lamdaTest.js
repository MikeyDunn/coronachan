// set the event data you want here
const event = {};
// mock the context if needed here
const context = {};
// retrieve the result of the lambda here
const cb = (err, res) => {
  console.log(err, res);
};

// load the file containing the Lambda handler
const lambda = require("./scrape.js");
// call the handler
lambda.handler(event, context, cb);
