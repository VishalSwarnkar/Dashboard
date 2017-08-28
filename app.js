var express = require('express'),
     path = require("path"),
    bodyParser = require('body-parser'),
    logger = require('loggy');

var app = express();

logger.info("Welcome to device certification tool app");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views/'));


var port = process.env.PORT || 1344;

app.listen(port, function(){
  console.log("server is running at port "+port);
});


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers['origin']);
    res.header("Access-Control-Max-Age", 20000);
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control");
//    res.header("Cache-Control", 'public, max-age=43200000');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '/public/javascript')));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.static(path.join(__dirname, '/public/json/')));

app.use(require('./routers/jiradata'));

app.get('/', function(req, res, next){
    res.send("Tool to generate the charts and table, after fetching data from jira api");
});

app.get('/:file(*)', function(req, res, next){
    var file = req.params.file
        , path = __dirname +"/"+file;
    console.log("File path ", path);
    res.download(path);
});

app.use(function(req, res, next){
   var err = new Error("Not Found");
   err.status = 404;
   next(err);
});

app.use(function(err, req, res, next){
   res.status(err.status || 500);
   res.render('error',{
      message: err.message,
      error: {}
   });
});
