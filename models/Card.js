function Card(rank, suit, color){
  this.rank = rank;
  this.suit = Card.suitHash[suit];
  this.color = Card.colorHash[color];
}

Card.suitHash = {
  S: '&#9824;',
  H: '&#9825;',
  D: '&#9826;',
  C: '&#9827;'
};

Card.colorHash = {
  S: 'black',
  H: 'red',
  D: 'red',
  C: 'black'
};

var Deck = ['2H',
  '10C',
  '12S',
  '4H',
  '1H',
  '13H',
  '4C',
  '13D',
  '9H',
  '13S',
  '6S',
  '11S',
  '9C',
  '6C',
  '10D',
  '1S',
  '7H',
  '4S',
  '12C',
  '6H',
  '13C',
  '7S',
  '3C',
  '2C',
  '3D',
  '12H',
  '8H',
  '5C',
  '12D',
  '8S',
  '4D',
  '2D',
  '9D',
  '11D',
  '5D',
  '11H',
  '10H',
  '6D',
  '9S',
  '7C',
  '11C',
  '5H',
  '5S',
  '10S',
  '1D',
  '3S',
  '8C',
  '2S',
  '3H',
  '8D',
  '1C',
  '7D'];

Card.drawRandomCard = function(pack){
  var rndmNo = Math.floor(Math.random()*(pack.length));
  var card = pack[rndmNo];
  pack.splice(rndmNo, 1);
  var rank =parseInt(card);
  var suit  = card.replace(/[^a-z]+/ig,"");
  return new Card(rank, suit, suit);
}
/*
Card.createPack = function() {  
  var suits = new Array("H","C","S","D");
  var pack = new Array();
  var n = 52;
  var index = n / suits.length;
  var count = 0;
  for(i = 0; i <= 3; i++){
    for(j = 1; j <= 13;j++){
      pack[count++] = j + suits[i];      
    }
  }
  return pack;
}
Card.shufflePack=function(pack) {  
  var i = pack.length, j, tempi, tempj;
  if (i === 0) return false;
  while (--i) {
   j = Math.floor(Math.random() * (i + 1));
   tempi = pack[i];
   tempj = pack[j];
   pack[i] = tempj;
   pack[j] = tempi;
 }
 return pack;
}

*/
module.exports = Card;
