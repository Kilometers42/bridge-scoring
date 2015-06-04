var fs = require("fs");
var addon = require('./build/Release/addon')
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
                    if(matches.length != 0){
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
            
                
                var pbnString= '[Deal "N:';
                pbnString=pbnString + curBoard.nHand.spades+'.'+curBoard.nHand.hearts+'.'+curBoard.nHand.diamonds+'.'+curBoard.nHand.clubs+' ';
                pbnString=pbnString + curBoard.eHand.spades+'.'+curBoard.eHand.hearts+'.'+curBoard.eHand.diamonds+'.'+curBoard.eHand.clubs+' ';
                pbnString=pbnString + curBoard.sHand.spades+'.'+curBoard.sHand.hearts+'.'+curBoard.sHand.diamonds+'.'+curBoard.sHand.clubs+' ';
                pbnString=pbnString + curBoard.wHand.spades+'.'+curBoard.wHand.hearts+'.'+curBoard.wHand.diamonds+'.'+curBoard.wHand.clubs;
                pbnString = pbnString.replace(/,/g, '');
                pbnString = pbnString.replace(/10/g, 'T');
                pbnString = pbnString.replace(/—/g, '');
                pbnString = pbnString + '"]';
                console.log(pbnString);
                var leaderArray = ['N','E','S','W'];
                var declarerLoc = leaderArray.indexOf(curBoard.declarer);
                var leader = (declarerLoc+1)%4;
                var altContract;
                
                altContract = curContract.slice(0,2);
                altContract = altContract.replace(/♠/,'S');
                altContract = altContract.replace(/♣/,'C');
                altContract = altContract.replace(/♦/,'D');
                altContract = altContract.replace(/♥/,'H');
                
                

                console.log(leader);
                console.log(altContract);
                
                addon(pbnString,leader,altContract,function(msg){

                var arr = Object.keys(msg).map(function(k) { return msg[k] });
                    console.log(arr)
                })

            }
        }
        cb(game);
    }        
};