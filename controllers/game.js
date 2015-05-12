var resultUrl = 'http://clubresults.acbl.org/Results/262592/2015/03/150318E.HTM';
// var resultUrl = 'http://clubresults.acbl.org/Results/113019/2015/04/150427E.HTM'; //Mom
//var resultUrl = 'http://www.tcbridgecenter.com/dailies/thue.htm';
var parser = require("../logic/parser.js");
var express = require("express");
var gameRepository = require('../repositories/gameRepository.js');
var router = express();
var bodyParser = require('body-parser')
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


router.get('/read', function(request, response){	
    gameRepository.readBoards(request.query, function(allGames){
        var boards = allGames[0].boards.filter(function(n){ return n != undefined }); 
        response.json(boards);
        // response.json({ result: allGames[0].boards, count: allGames[0].boards.length}  );
        response.end();
    });
    
});

router.get('/create', function(request, response) {
    parser.parse(resultUrl, function(game){
        gameRepository.save(game, function (argument) {
           response.json({success: 'true'});
        });
    });
})

router.get('/analysisList', function(request, response) {
   response.json([{tag: 'Misplayed'} , {tag: 'Well Played'}, {tag: 'Good Defense'}, {tag: 'Misdefended'}]);
})

router.post('/update', function(request, response) {
   gameRepository.updateBoard(request.body.value, function(){
       response.json({success:true});
       response.end();
   })
   
   
})


module.exports = router;