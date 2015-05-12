var express = require("express");
var gameRepository = require('../repositories/gameRepository.js');
var router = express();
var parser = require("../logic/parser.js");
var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

router.get('/read', function(request, response){	
    gameRepository.readAll(function(allGames){
        response.json(allGames);
        response.end();
    });
});

router.post('/create', function(request, response) {
    parser.parse(request.body, function(game){
        gameRepository.save(game, function (argument) {
          response.json({success: 'true'});
          response.end();
        });
    });
    
})

module.exports= router;