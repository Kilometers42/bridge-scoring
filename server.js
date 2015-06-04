
var express = require("express");
var path = require("path");
var homeController = require("./controllers/home.js");
var gameController = require("./controllers/game.js");
var allGameController = require("./controllers/allGames.js");

// var staticController = require("./controlllers/static.js")

var app = express();






app.set('views',path.join(__dirname, '/client/views' ));
app.set('view engine', 'ejs');
app.use('/', homeController);
app.use('/game', gameController);
app.use('/allGames', allGameController);
// app.use(express.compress());
app.use('/client', express.static(__dirname + '/client'));

// app.use('/client', staticController);
// app.get('/', function (req, res) {
//   res.send(express.static();
// });

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

// function router(request, response){
//   parser.parse(resultUrl, function(game){
//     console.log(game)
//     response.writeHeader(200);
//     response.write(JSON.stringify(game));
//     response.end();
//   });

// }