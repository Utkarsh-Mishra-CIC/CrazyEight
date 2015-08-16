$(document).ready(function() {

  var socket = io();

  socket.on('onPlayerConnected', refreshPlayersList);
  socket.on('onPlayersRefreshed', refreshPlayersList);

  socket.on('onSelectedForPlaying', function(data){
    var wantedTo = confirm(players[data.opponentId].name + " wanted to play with you. Do you want it too?");

    socket.emit('onResponseToRequestForPlaying', { opponentId: data.opponentId, wantedTo: wantedTo, playerId: socket.id });
  });

  socket.on('onRequestForPlayingDeclined', function(data){
    alert('Sorry the ' + players[data.opponentId].name + " has declined your request");
  });

	socket.on('diplayedMessage',function(message){
    displayMessage(message);
});
  socket.on('onSetupGameForPlaying', function(data){
	
    $(window.document.documentElement).addClass('start-game');
    $('#box3').removeClass('no-display').addClass('yes-display');
    delete(window.players);
    window.player = data.you;
    window.opponent = data.opponent;
    setOpponentCards(data.opponent);
    setMyCards(data.turn,data.you);
    setUpFirstCard(data.firstCard);
	
	
  });
  
socket.on('onGame', function(data){
    if(data.turn){
	$('#drawACard').removeClass('cannot-draw').addClass('can-draw');
        $('#myCards li').parent().removeClass('cannot-play').addClass('can-play');
	setOpponentCards(data.opponent);
        setMyCards(data.turn,data.you);
   }	
});
    
socket.on('onPass',function(data){
if(data.turn){
	$('#drawACard').removeClass('cannot-draw').addClass('can-draw');
        $('#myCards li').parent().removeClass('cannot-play').addClass('can-play');
	setOpponentCards(data.opponent);
        setMyCards(data.turn,data.you);
   }else {
	$('#drawACard').removeClass('can-play').addClass('cannot-draw');
        $('#myCards li').parent().removeClass('can-play').addClass('cannot-play');
	setOpponentCards(data.opponent);
        setMyCards(data.turn,data.you);
   }	
});
    
	

    
 
socket.on('onCardDrawn', function(data){
	setMyCards(data.turn,data.playerId);
});

socket.on('onOpponentCardSelected', function(data){
    var randomValue = Math.floor(Math.random()*10)%($('#opponentCards li').length);
    $($('#opponentCards li')[randomValue]).fadeOut().remove();
    setUpFirstCard(data.card);
});

  socket.on('onOpponentDisconnect', function(){
    window.location.reload();
  });

  socket.on('onOpponentCardDrawn', function(){
    $('#opponentCards ul').append($('<li>#</li>'));
  });

  socket.on('onOpponentWon', function(){
    alert('You lose');
    window.location.reload();
  });


  function refreshPlayersList(data){
    $('#ce-players-list').empty();
    window.players = data.players;
    for (var a in data.players) {
      if (data.players.hasOwnProperty(a)) {
        if (a != socket.id) {
          if (!data.players[a].isPlaying) {
            $('#ce-players-list').append($("<li><a data-id=\"" + a + "\" class=\"ce-player\" href=\'#\'>" + data.players[a].name + "</a></li>"))
          }
        }
      }
    }
    $('.ce-player').click(function(e){
      e.preventDefault();
      var $this = $(this);
      socket.emit('onOpponentSelected', {playerId: socket.id, opponentId: $this.data('id')});
    });
  }

  $('#drawACard').click(function(e){
    e.preventDefault();
    var $this = $(this);
    var showCardEl = $('#showCard');
    var showCard = {
        rank: $($(showCardEl).children()[0]).html(),
        suit: $($(showCardEl).children()[1]).html()
      }
    socket.emit('onDrawCard',{showCard:showCard});
  });

 $('#passTurn').click(function(){
socket.emit('onPassTurn',{id:socket.id});
});


  function setOpponentCards(opponentId){
	$('#opponentCards ul').empty();
        for (var i = 0; i <= opponentId.cards.length ; i++) {
           var li = document.createElement('li');
           $('#opponentCards ul').append($('<li>#</li>'))
        }
  }

  function setMyCards(turn,playerId){
    var cardss = playerId.cards;
    $('#myCards ul').empty();
    for (var i = 0; i < cardss.length; i++) {
	var li = document.createElement('li');
        $('#myCards ul').append($('<li data-color=\"' + cardss[i].color + '\" data-id=' + i + '><span class=\"card-rank\">' + cardss[i].rank + '</span>' + '<span class=\"card-suit card-' + cardss[i].color + '\">' + cardss[i].suit  + '</span></li>'));
    }
    var cardNodes = $('#myCards li');
    if(turn){
     cardNodes.click(function(){
      var card = {
        rank: $($(this).children()[0]).html(),
        suit: $($(this).children()[1]).html(),
        color: $(this).data('color')
      }
      var showCardEl = $('#showCard');
      var showCard = {
        rank: $($(showCardEl).children()[0]).html(),
        suit: $($(showCardEl).children()[1]).html()
      }
	    
	
      if (showCard.rank === card.rank || showCard.suit === card.suit || card.rank == '8') {
        $('#drawACard').addClass('cannot-draw');
        $(this).parent().addClass('cannot-play');
	var index=$(this).index();
	playerId.cards.splice($(this).index(),1);
	console.log(playerId.cards + 'p1');
        socket.emit('onCardSelected', { card: card, opponentId: opponent.id,id:socket.id,playerCards:playerId.cards});
        setUpFirstCard(card);
        displayMessage('Yeah!!! Good!');
        $(this).fadeOut();
        $(this).remove();
      }
      else{
        displayMessage('Sorry you cannot select that card');
      }
      cardNodes = $('#myCards li');
      if (cardNodes.length < 1) {
        alert('You win');
        socket.emit('onPlayerWin');
        window.location.reload();
      }
	if (packs[id].length < 1) {
        socket.emit('onPlayerWin');
        window.location.reload();
}
    });
}
  else { 
	$('#drawACard').addClass('cannot-draw');
        $('#myCards li').parent().addClass('cannot-play');
	}  
  }
  


  function setUpFirstCard(firstCard){
    var h = '<span class=\"card-rank\">' + firstCard.rank + '</span>' + '<span data-color=\"' + firstCard.color + '\" class=\"card-suit card-' + firstCard.color + '\">' + firstCard.suit  + '</span>';
    $('#showCard').children().remove();
    $('#showCard').html(h);
  }

  function displayMessage(message){
    $('#messages').empty();
    $('#messages').html(message);
  }

  window.socket = socket;

});
