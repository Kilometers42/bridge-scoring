module.exports = { 
    analyze: function (game, cb){
        console.log(game);
        for (var i in game.boards) {
            var curBoard = game.boards[i];
            var curContract = game.boards[i].contract;
            if (typeof curContract !== 'undefined') {
                if (game.boards[i].contract.match(/[♠♣♦♥]/) != null){
                    var test = game.boards[i].contract.match(/[♠♣♦♥]/)[0];
                    var matches = game.boards[i].doubleDummy.results.filter(function(str) {
                        return str.search(test)>=0;
                    });
                    
                    var numberMade; 
                    if (game.boards[i].made > 0) {
                        numberMade = parseInt(game.boards[i].made);
                    } else{
                        numberMade = parseInt(game.boards[i].contract.match(/\d/)[0]) - parseInt(game.boards[i].made.match(/\d/)[0]);    
                    }
                    var shouldMake = matches[0].match(/\d+/)[0];
                    game.boards[i].analysis = [];
                    if (matches[0].match(game.direction)!= null) {
                        if(shouldMake - numberMade > 0){
                            game.boards[i].analysis.push('Misplayed');
                        }else if(shouldMake - numberMade < 0 ){
                            game.boards[i].analysis.push('WellPlayed')                            
                        }
                    } else {
                        if(shouldMake - numberMade > 0){
                            game.boards[i].analysis.push('Good Defense');
                        }else if(shouldMake - numberMade < 0 ){
                            game.boards[i].analysis.push('Misdefended')                            
                        }
                    }
                }
            }
            
        }
        cb(game);
    }        
};