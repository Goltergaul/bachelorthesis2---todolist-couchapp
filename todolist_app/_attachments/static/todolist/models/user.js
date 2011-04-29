$.Model.extend('Todolist.Models.User',
/* @Static */
{
  
  attributes : { 
    name : 'string',
    password  : 'string'
  },
  
	/**
	 * Creates a new User.
	 * @param {Object} attrs A users's attributes.
	 * @param {Function} success a callback function that indicates a successful create. The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
	  var password = attrs.password;
	  delete attrs.password
		$.couch.signup(attrs, password, {
      success: success
    });
	},
	
	logout: function(callback) {
    $.couch.logout({success: callback});
  },
  
  session: function(callback) {
    $.couch.session({success: callback}); 
  }
},
/* @Prototype */
{
  login: function(callback) {
    var options = {
      success: callback,
      error: callback
    };
    jQuery.extend(options, this.attrs())
    $.couch.login(options);
  }  
});