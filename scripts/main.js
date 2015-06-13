$(document).ready(function() {

	// put the players name in the global namespace
	var name = '';
	
	// save html element templates for later
	var responseTemplate = '<div class="btn-group btn-group-lg" role="group"><button type="button" class="btn btn-default">each answer</button></div>';
	var inputTemplate = '<div id="input-container"><div id="submit-field" class="input-group input-group-lg" style="margin-top: 20px"><span class="input-group-btn"><button class="btn btn-success" type="button" id="submit">Submit!</button></span><input type="text" class="form-control" placeholder="Your Name" id="playerName"></div><!-- /input-group --></div><!-- /input-container -->';

	// set the initial state
	var start = g.startingPoint;
	playGame(start);

	// returns the next node for the given answer and current node
	function nextNode(node, answer) {
	  if (typeof answer === 'undefined')
	    return g.getNode(node.route('always'));
	  console.log('here');
	  return g.getNode(node.route(answer))
	};

	// the game's internal logic
	function playGame(node) {
		var choices = node.getConnectionStrings();

		// check if there are no choices available
		if (!choices.length) {
			// run game over script

			// set choices to yes or no
			choices = ['I would love to'];

			// change current node's connections to reset state
			node.connections = [new Connection(g.startingPoint.title, choices[0])];

			// ask if they want to play again
			node.text = node.text + ' Would you like to play again?';
		}

	  	// - update the game state -
		  	
		// set the question text
		$('#question-text').find('p').text(node.text.replace(/<%\s*name\s*%>/g, name));

		// remove the old buttons or input field
		var buttonContainer = $('#answers-container');
		buttonContainer.empty();

	  	// check if the node expects no responses
		if (choices[0] === 'always') {
			// replace the buttons with a text field
			buttonContainer.empty();
			buttonContainer.append($(inputTemplate));

			// add event listener to the name input field, and focus on it
			var inputField = $('#playerName');
			inputField.keypress(function(e) {
				if (e.which === 13) {
					// save the name
					name = $(this).val();
					console.log(name);

					playGame(nextNode(start));
				}
			});
			inputField.focus();

			// add listener to the submit button
			$('#submit-field').on('click', 'button', function() {
				name = $(this).parent().next().val();
				console.log(name);
				playGame(nextNode(start));
			});
		} else {
		  	// create a new button for each choice, and append it to the container
		  	for (var i = 0; i < choices.length; i++) {
		  		// console.log(responseTemplate);
		  		var newButton = $(responseTemplate);
		  		newButton.find('button').text(choices[i]);
		  		buttonContainer.append(newButton);
		  	}

		  	// add the event listeners to each button
		  	var buttons = $('#answers-container').find('button');
		  	for (var i = 0; i < buttons.length; i++) {
				$(buttons[i]).on('click', function() {
					var answer = $(this)[0].textContent;
					playGame(nextNode(node, answer));
				});
			}
		}
	}
});