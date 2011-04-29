steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/model/associations',
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params')		// form data helper
	
	.then(function() { steal('../jquery/jquery-ui') })
	
	.css('../cupertino/jquery-ui-1.8.11.custom', 'todolist')	// loads styles

	.resources('couch', 'sha1', 'jquery.tokeninput').then(function() {
	  
	  window.db = $.couch.db("todolist(public)");
	  
	})					// 3rd party script's (like jQueryUI), in resources folder

	.models('todo', 'list', 'user')						// loads files in models folder 

	.controllers('application', 'todo', 'list')					// loads files in controllers folder

	.views('application', 'todo', 'list');					 // adds views to be added to build
