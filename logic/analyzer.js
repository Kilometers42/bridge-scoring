var fs = require("fs");
var addon = require('./build/Release/addon')
var exec = require('child_process').exec;
module.exports = { 
    analyze: function (game, cb){
        console.log(game);
        for (var i in game.boards) {
            var curBoard = game.boards[i];
            var curContract = game.boards[i].contract;
            if (typeof curContract !== 'undefined' && curContract !== 'Pass') {
                var pbnString= '[Deal "N:';
                pbnString=pbnString + curBoard.nHand.spades+'.'+curBoard.nHand.hearts+'.'+curBoard.nHand.diamonds+'.'+curBoard.nHand.clubs+' ';
                pbnString=pbnString + curBoard.eHand.spades+'.'+curBoard.eHand.hearts+'.'+curBoard.eHand.diamonds+'.'+curBoard.eHand.clubs+' ';
                pbnString=pbnString + curBoard.sHand.spades+'.'+curBoard.sHand.hearts+'.'+curBoard.sHand.diamonds+'.'+curBoard.sHand.clubs+' ';
                pbnString=pbnString + curBoard.wHand.spades+'.'+curBoard.wHand.hearts+'.'+curBoard.wHand.diamonds+'.'+curBoard.wHand.clubs;
                pbnString = pbnString.replace(/,/g, '');
                pbnString = pbnString.replace(/10/g, 'T');
                pbnString = pbnString.replace(/—/g, '');
                pbnString = pbnString + '"]';
                
                var leaderArray = ['N','E','S','W'];
                var declarerLoc = leaderArray.indexOf(curBoard.declarer);
                var leader = (declarerLoc+1)%4;
                var altContract;
                
                altContract = curContract.slice(0,2);
                altContract = altContract.replace(/♠/,'S');
                altContract = altContract.replace(/♣/,'C');
                altContract = altContract.replace(/♦/,'D');
                altContract = altContract.replace(/♥/,'H');
        
                addon(pbnString,leader,altContract,function(msg){
                    var arr = Object.keys(msg).map(function(k) { return msg[k] });
                    var optimalMade = arr[0].numberMade;
                    var cleanLead = [];
                    var leadMade;
                    game.boards[i].analysis = [];
                    var equivalentLead = curBoard.lead.slice(0,2);
                    var hand;
                    switch (leader) {
                        case 0:
                            hand = curBoard.nHand;
                            break;
                        case 1:
                            hand = curBoard.eHand;
                            break;
                        case 2:
                            hand = curBoard.sHand;
                            break;
                        case 3:
                            hand = curBoard.wHand;
                            break;
                    }
                    var suit;
                    if (curBoard.lead[0] === '♠') {
                        suit = hand.spades;
                    }else if (curBoard.lead[0] === '♣') {
                        suit = hand.clubs;
                    }else if (curBoard.lead[0] === '♦') {
                        suit = hand.diamonds;
                    }else if (curBoard.lead[0] === '♥') {
                        suit = hand.hearts;
                    }
                    var cardValue = curBoard.lead.slice(2);
                    var possibleCards = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
                    var cardNumberValue = possibleCards.indexOf(cardValue);
                    if (suit.indexOf(possibleCards[cardNumberValue]) != -1) {
                        while(equivalentLead.length == 2){
                            if(suit.indexOf(possibleCards[cardNumberValue+1]) != -1){
                                cardNumberValue++;
                            }else{
                                equivalentLead+= possibleCards[cardNumberValue];
                            }
                        }
                    } else{
                        game.boards[i].analysis.push('Unknown Lead - assumed lead to be lowest card in suit'); 
                        equivalentLead = suit[suit.length-1];
                        //To do add error handling here
                    }

                    for(var j in arr){
                        cleanLead.push({lead: arr[j].lead.slice(0,3), numberMade: arr[j].numberMade});                 
                        cleanLead[j].lead = cleanLead[j].lead.replace(/S/,'♠');
                        cleanLead[j].lead = cleanLead[j].lead.replace(/C/,'♣');
                        cleanLead[j].lead = cleanLead[j].lead.replace(/D/,'♦');
                        cleanLead[j].lead = cleanLead[j].lead.replace(/H/,'♥');
                        cleanLead[j].lead = cleanLead[j].lead.replace(/T/, '10');
                        if(cleanLead[j].lead === equivalentLead){
                            leadMade = cleanLead[j].numberMade
                        }
                    }
                    game.boards[i].leadTable = cleanLead;
                    var declarerMade; 
                    if (game.boards[i].made > 0) {
                        declarerMade = parseInt(game.boards[i].made) + 6;
                    } else{
                        declarerMade = parseInt(game.boards[i].contract.match(/\d/)[0]) - parseInt(game.boards[i].made.match(/\d/)[0]) +6;    
                    }
                    
                    if (curBoard.playersDirection.match(curBoard.declarer)) {
                        if(cleanLead[0].numberMade > leadMade){
                            game.boards[i].analysis.push('Helpful Lead');
                        }
                        
                        if((13-leadMade) - declarerMade > 0){
                            game.boards[i].analysis.push('Misplayed');
                        }else if((13-leadMade) - declarerMade < 0 ){
                            game.boards[i].analysis.push('Well Played');                            
                        }
                    } else {
                        if(cleanLead[0].numberMade > leadMade){
                            game.boards[i].analysis.push('Harmful Lead');
                        }
                        if((13-leadMade) - declarerMade> 0){
                            game.boards[i].analysis.push('Good Defense');
                        }else if((13-leadMade) - declarerMade < 0 ){
                            game.boards[i].analysis.push('Misdefended');                            
                        }
                    }
                    
                    console.log(cleanLead);
                    console.log(leadMade);
                });

            }
        }
        cb(game);
    }        
};