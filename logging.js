var express = require('express');
var app = express();
var router = express.Router();

// debug
const debug = require('debug')('errorhandling')  
const name = 'errorhandling'  
debug('booting %s', name)  
// loging
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    // new (winston.transports.File)({
    //   filename: `${logDir}/results.log`,
    //   timestamp: tsFormat,
    //   level: env === 'development' ? 'debug' : 'info'
    // })
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'development' ? 'verbose' : 'info'
    })
  ]
});
// levels are { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
logger.level = 'info'  
logger.log('info', 'Hello log files!', {  
  someKey: 'some-value'
})
logger.log('debug', 'Now my debug messages are written to console!');
logger.info('Hello world');
logger.warn('Warning message');
logger.debug('Debugging info');

// routes
router.get('/',function(req,res) {
  throw new Error();
  res.send("Hello World!");
});

app.use('/',router);

app.use(function(err,req,res,next) {
  console.log(err.stack);
  res.status(500).send({"Error" : err.stack});
});

app.listen(3000);