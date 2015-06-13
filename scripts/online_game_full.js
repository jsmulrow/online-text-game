/////   Node.js

var Node = function(title, text) {
  this.title = title;
  this.text = text;
  this.connections = [];
};

Node.prototype.connect = function(node2, cond) {
  this.connections.forEach(function(connection) {
    if (connection.condition === cond) {
      throw error;
    }
  });
  this.connections.push(new Connection(node2, cond));
};

Node.prototype.route = function(cond) {
  var matchedNode;
  this.connections.forEach(function(connection) {
    if (connection.test(cond))
      matchedNode = connection.nextNode;
  });
  return matchedNode;
};

Node.prototype.getConnectionStrings = function() {
  return this.connections.map(function(connection) {
    return connection.condition;
  });
};

Node.prototype.hasConnectionCondition = function(cond) {
  return this.connections.some(function(connection) {
    return connection.test(cond);
  });
};


////// Connection.js

var Connection = function(nextNode, condition) {
  this.nextNode = nextNode;
  this.condition = condition;
};

Connection.prototype.test = function(cond) {
  if (this.condition === undefined) {
    return true;
  }
  return cond === this.condition;
};


///// game.js

var Game = function() {
  this.nodes = {};
  this.startingPoint = null;
};

Game.prototype.addNode = function(title, text) {
  if (this.nodes.hasOwnProperty(title)) {
    throw error;
  }
  this.nodes[title] = new Node(title, text);
  if (this.startingPoint === null) {
    this.startingPoint = this.nodes[title];
  }
  return this.nodes[title];
};

Game.prototype.getNode = function(title) {
  return this.nodes[title];
};

Game.prototype.connect = function(first, second, condition) {
  if (typeof condition === 'undefined')
    condition = 'always';
  if (!this.nodes.hasOwnProperty(first) || !this.nodes.hasOwnProperty(second)) {
    throw error;
  }
  this.nodes[first].connect(second, condition);
};


/////   game.source.js

// this file defines an actual game that will be played

var g = new Game();

g.addNode('welcome', 'Welcome. What is your name?');

g.addNode('direction', 'Hi <% name %>, do you choose to go left, or right?');

g.addNode('leftResp', 'Ah, good choice, <% name %>. Good choice. Now what color is the best?');
g.addNode('rightResp', 'There be dragons there. One asks you your favorite color - your response?');

g.addNode('offended', 'Your answer offends the red dragon. In his haste to flee, he stomps on you. Game over.');

g.addNode('yep', 'That is correct. You come upon an abandonded house, what do you do?');
g.addNode('wrong', 'You would be incorrect, <% name %>. Try again.');

g.addNode('ghost', 'Inside you find a spooky ghost. What will you do, <%name%>??');

g.addNode('gameOver', 'You die of a sudden heart-attack. Too bad, <%name%>.');
g.addNode('success', 'Congratulations, <%name%>! You and the ghost live happily ever after.');

g.connect('welcome', 'direction', 'always');

g.connect('direction', 'leftResp', 'left');
g.connect('direction', 'rightResp', 'right');

g.connect('leftResp', 'wrong', 'green');
g.connect('leftResp', 'yep', 'blue');
g.connect('leftResp', 'wrong', 'red');

g.connect('rightResp', 'offended', 'blue');
g.connect('rightResp', 'yep', 'red');

g.connect('wrong', 'yep', 'blue');
g.connect('wrong', 'wrong', 'green');
g.connect('wrong', 'wrong', 'red');

g.connect('yep', 'gameOver', 'do not enter');
g.connect('yep', 'ghost', 'enter');

g.connect('ghost', 'success', 'befriend it');
g.connect('ghost', 'gameOver', 'run away');