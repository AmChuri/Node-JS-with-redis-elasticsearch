var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var redis=require('redis');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var clientredis = redis.createClient();
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
  keepAlive: 'true'
});

var stringsample;

app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
app.post('/post',urlencodedParser, function(req, res) {
stringsample=req.body.string;
console.log(stringsample);
runSample(stringsample)
runelastic(stringsample)
clientredis.get("string", function (err, reply) {
	res.send(reply.toString());
})
var sample = req.body.username;

console.log(stringsample);
runSample(stringsample)
runelastic(stringsample)
searchsample(stringsample)
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://localhost:%s",+port)

})

clientredis.on("connect",runSample);
function runSample(stringsample) {
clientredis.set("string",stringsample,function(err, reply){
        console.log(reply.toString());
    });
/*clientredis.get("string", function (err, reply) {
	console.log(reply.toString());
//redisdata(reply)
})*/
//clientredis.keys('*', function (keys) { for (key in keys) { console.log(key); } });
}

function runelastic(stringsample){
client.ping({
  requestTimeout: 30000,

  // undocumented params are appended to the query string
  string: stringsample
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
}
function searchsample(stringsample){
client.search({
  q: stringsample
}).then(function (body) {
  var hits = body.hits.hits;
}, function (error) {
  console.trace(error.message);
});
}
