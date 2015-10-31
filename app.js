var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var player = require('./models/Player');
var turn=[];
var players = {};
var packs = {};
var card = require('./models/Card');
app.use(express.static('public'));// Pass the name of the directory, which is to be marked as the location of static assets, to the express

app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('A user is connected');

  players[socket.id] = new player(socket.id);
  packs[socket.id] = new Array('2H','10C','12S',  '4H','1H', '13H',  '4C',  '13D',  '9H',  '13S',  '6S',  '11S',  '9C',  '6C',  '10D',  '1S',  '7H','4S',  '12C',  '6H',  '13C',  '7S',  '3C',  '2C',  '3D',  '12H',  '8H',  '5C',  '12D',  '8S',  '4D',  '2D',  '9D',  '11D',  '5D',  '11H',   '10H',  '6D',  '9S',  '7C',  '11C',  '5H',  '5S',  '10S',  '1D',  '3S',  '8C',  '2S',  '3H',  '8D',  '1C',  '7D');
  turn[socket.id]=0;


  io.emit('onPlayerConnected', { players: players });

  socket.on('disconnect', function(){
    console.log('User is disconnected');
    if (players[socket.id].isPlaying) {
      var opponentId = players[socket.id].opponentId;
      io.sockets.connected[opponentId].emit('onOpponentDisconnect', {});
      players[opponentId].isPlaying = false;
    }
    delete(players[socket.id]);
    io.emit('onPlayersRefreshed', { players: players });
  });

  socket.on('onOpponentSelected', function(data){
    var opponentSocket = io.sockets.connected[data.opponentId];
    opponentSocket.emit('onSelectedForPlaying', { opponentId: data.playerId });
  });
  
  socket.on('onCardSelected', function(data){
     console.log(data.id);
	turn[data.id]=0;
	turn[data.opponentId]=1;
	players[data.id].cards=[];
	players[data.id].cards=data.playerCards;

   /* if (data.card.rank == '7') {
      io.sockets.connected[data.opponentId].emit('onSelectedCard7', { card: data.card });
    }
    else if (data.card.rank == '11') {
      io.sockets.connected[data.opponentId].emit('onSelectedCard11', { card: data.card });
    }
    else if(data.card.rank == '9'){
      io.sockets.connected[data.opponentId].emit('onSelectedCard9', { card: data.card });
    }*/
    io.sockets.connected[data.id].emit('onGame', { you: players[data.id], opponent: players[data.opponentId], turn:turn[data.id]});
      io.sockets.connected[data.opponentId].emit('onGame', { you: players[data.opponentId], opponent: players[data.id],turn:turn[data.opponentId]});
      io.emit('onPlayersRefreshed', { players: players })
    socket.emit('onSelectedCardResponse', {  });
    io.sockets.connected[data.opponentId].emit('onOpponentCardSelected', { card: data.card });
  });

  socket.on('onDrawCard', function(data){
	if (packs[socket.id].length > 0){
           	var opponentId = players[socket.id].opponentId;
    		var randomCard = card.drawRandomCard(packs[socket.id]);
		players[socket.id].cards.push(randomCard);
		packs[opponentId]=[];
	        packs[opponentId] = packs[socket.id];
		socket.emit('onCardDrawn', { card:randomCard,turn:turn[socket.id],playerId:players[socket.id]});
    		io.sockets.connected[opponentId].emit('onOpponentCardDrawn');
	}
	else {
		socket.emit('diplayedMessage','No card left in deck'); 
		var pcard = players[socket.id].cards;
		var count=0;
		for(i=0;i < pcard.length;i++){
			if (pcard[i].suit === data.showCard.suit || data.showCard.rank === pcard[i].rank || pcard[i].rank == '8') {
				count= count + 1;
	        	}
		}
		if (count>1) {
			socket.emit('diplayedMessage','you have cards to play');
		} else {
			if (players[socket.id].cards.length < players[opponentId].cards.length) {
				alert('You win');
		        } else {
				alert('You Lose');
		        }
			players[socket.id].stopPlaying();
        		players[opponentId].stopPlaying();
        		io.sockets.connected[opponentId].emit('onOpponentWon');
        		io.emit('onPlayersRefreshed', { players: players });
		}	
	}
  });
 
socket.on('onPassTurn',function(data){
var opponentId = players[data.id].opponentId;
console.log(data.id + 'efe' +  opponentId);
turn[data.id] = 0;
turn[opponentId] = 1;
 io.sockets.connected[data.id].emit('onPass', { you: players[data.id], opponent: players[opponentId], turn:turn[data.id]});
      io.sockets.connected[opponentId].emit('onPass', { you: players[opponentId], opponent: players[data.id],turn:turn[opponentId]});
});

  socket.on('onResponseToRequestForPlaying', function(data){
    if (data.wantedTo) {     
      players[data.playerId].startPlaying(packs,data.opponentId);
       for (var i = 0; i < 6; i++) {
       		players[data.playerId].cards.push(card.drawRandomCard(packs[data.playerId]));
       }
	packs[data.opponentId]=[];
        packs[data.opponentId]=packs[data.playerId];


        players[data.opponentId].startPlaying(packs,data.playerId);
	for (var i = 0; i < 6; i++) {
       		players[data.opponentId].cards.push(card.drawRandomCard(packs[data.opponentId]));
       }
	packs[data.playerId]=[];
        packs[data.playerId]=packs[data.opponentId];
      var firstCard = card.drawRandomCard(packs[socket.id]);
      packs[data.opponentId]=[];
	packs[data.opponentId]=packs[socket.id];
	turn[data.playerId]=1;	
      io.sockets.connected[data.playerId].emit('onSetupGameForPlaying', { you: players[data.playerId], opponent: players[data.opponentId], firstCard: firstCard,turn:turn[data.playerId]});
      io.sockets.connected[data.opponentId].emit('onSetupGameForPlaying', { you: players[data.opponentId], opponent: players[data.playerId], firstCard: firstCard,turn:turn[data.opponentId]});
      io.emit('onPlayersRefreshed', { players: players })
    }
    else{
      console.log('Request Declined');
      var opponentSocket = io.sockets.connected[data.opponentId];
      opponentSocket.emit('onRequestForPlayingDeclined', { opponentId: data.playerId });
    }
  });

  socket.on('onPlayerWin', function(){
    var opponentId = players[socket.id].opponentId;
	if(players[socket.id].cards.length < players[opponentId].cards.length) {
        alert('You win');
}
if(players[socket.id].cards.length > players[opponentId].cards.length) {
        alert('You lose');
}
    players[socket.id].stopPlaying();
    players[opponentId].stopPlaying();
    io.sockets.connected[opponentId].emit('onOpponentWon');
    io.emit('onPlayersRefreshed', { players: players });
  });
});

http.listen(3000, function(){
  console.log("Application is listening on 3000");
});
