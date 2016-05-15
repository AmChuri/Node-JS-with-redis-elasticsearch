var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var redis=require('redis');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var clientredis = redis.createClient(); //creating Redis Client
var elasticsearch = require('elasticsearch');

//creating Elasticsearch Client
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
  keepAlive: 'true'
});

var stringsample; //Taking variable to store value

//Using Express App to render HTML page
app.use(express.static('public'));

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
app.post('/post',urlencodedParser, function(req, res) {
stringsample=req.body.string;
console.log(stringsample);
runSample(stringsample) //callback to update redis value
runelastic(stringsample) //callback to update elasticsearch value
clientredis.get("string", function (err, reply) {
	res.send(reply.toString()); //Redenring back value from Redis
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

clientredis.on("connect",runSample); //Starting Function to update Redis Value
function runSample(stringsample) {
clientredis.set("string",stringsample,function(err, reply){
        console.log(reply.toString());
    });
}

function runelastic(stringsample){ //Function to update Elasticsearch Value
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
function searchsample(stringsample){ //Function to Search in Elasticsearch
client.search({
  q: stringsample
}).then(function (body) {
  var hits = body.hits.hits;
}, function (error) {
  console.trace(error.message);
});
}
