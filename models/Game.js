function Game(){
  this.cards = {
    0: [],
    1: [],
    2: [],
    3: []
  };
  for (var i = 0; i < 4 ; i++) {
    for (var j = 0; j < 13; j++) {
      this.cards[i].push(new card(j, i, i));
    }
  }
}

Game.prototype.drawRandomCard = function(){
  var rank = ((Math.floor(Math.random()*100))%13) + 1;
  var suit = (Math.floor(Math.random()*10))%4;
  if (this.cards[suit].length < 1) {
    suit =
  }
}

module.exports = Game;
