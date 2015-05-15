var fs = require("fs");
var exec = require('child_process').exec;
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
            
                
                var pbnString= '[Deal "N:';
                pbnString=pbnString + curBoard.nHand.spades+'.'+curBoard.nHand.hearts+'.'+curBoard.nHand.diamonds+'.'+curBoard.nHand.clubs+' ';
                pbnString=pbnString + curBoard.eHand.spades+'.'+curBoard.eHand.hearts+'.'+curBoard.eHand.diamonds+'.'+curBoard.eHand.clubs+' ';
                pbnString=pbnString + curBoard.sHand.spades+'.'+curBoard.sHand.hearts+'.'+curBoard.sHand.diamonds+'.'+curBoard.sHand.clubs+' ';
                pbnString=pbnString + curBoard.wHand.spades+'.'+curBoard.wHand.hearts+'.'+curBoard.wHand.diamonds+'.'+curBoard.wHand.clubs;
                pbnString = pbnString.replace(/,/g, '');
                pbnString = pbnString.replace(/10/g, 'T');
                pbnString = pbnString + '"]';
                console.log(pbnString);
                var fileName = 'test' + i +'.pbn'
                
                // fs.writeFile("/home/ubuntu/workspace/logic/"+ fileName, pbnString, function(err) {
                //     if(err) {
                //         return console.log(err);
                //     }
                //     setTimeout( function() {
                //     exec('cd /home/ubuntu/workspace/logic ;wine leadsolver.exe -p 3N '+fileName, function (error, stdout, stderr) {
                //         console.log('here')
                //         console.log(stdout)
                //         console.log(error)
                //     })}, 5000)
                    
                //     console.log("The file was saved!");
                    
                    
                // });
            }
        }
        cb(game);
    }        
};