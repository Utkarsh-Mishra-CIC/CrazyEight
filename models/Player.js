var card = require('./Card');

function Player(id){
  this.name = "Player #" + id.substring(0,4);
  this.cards = [];
  this.id = id;
  this.isPlaying = false;
}

Player.prototype.startPlaying = function(packs,opponentId, game){
  this.opponentId = opponentId;
  this.isPlaying = true;
}

Player.prototype.decks = function(){
  this.deck= Deck;
  console.log('deck' + this.deck);
}

Player.prototype.stopPlaying = function(){
  this.cards = [];
  this.opponentId = null;
  this.isPlaying = false;
}

module.exports = Player;
