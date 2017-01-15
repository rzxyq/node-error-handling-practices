var express = require('express');
var app = express();
var router = express.Router();

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