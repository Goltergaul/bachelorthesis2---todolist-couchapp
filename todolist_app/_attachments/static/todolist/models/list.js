/**
 * @tag models, home
 * Wraps backend todo services.  Enables 
 * [Todolist.Models.Todo.static.findAll retrieving],
 * [Todolist.Models.Todo.static.update updating],
 * [Todolist.Models.Todo.static.destroy destroying], and
 * [Todolist.Models.Todo.static.create creating] todos.
 */
$.Model.extend('Todolist.Models.List',
/* @Static */
{
  
  attributes : { 
    title : 'string',
    owners : 'array',
    todos: 'array',
    _rev: 'string'
  },
  
  associations : {
    hasMany : "Todolist.Models.Todo"
  },
  
  hidden_attributes : {
    type  : 'list'
  },
  
  getDocument : function(attrs) {
    jQuery.extend(attrs, this.hidden_attributes);
    
    delete attrs.todos // die gehören nicht in dieses DB Dolument
    
    return attrs;
  },
  
  wrapMany : function(rows) {
    var self = this;
    var data = [];
    $(rows).each(function(i, row) {
      data.push(self.transform(row));
    });
    
    return data;
  },
  
  transform : function(row) {
    if(!row.doc.todos)
      row.doc.todos = [];
    return this.wrap({
        id: row.id,
        _rev: row.doc._rev,
        title: row.doc.title,
        owners: row.doc.owners,
        todos: row.doc.todos
      });
  },

	/**
 	 * Retrieves lists data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped todo objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
	  var self = this;
	  jQuery.extend(params, {
	    include_docs: true,
	    startkey: [Todolist.Controllers.Application.SESSION],
	    endkey: [Todolist.Controllers.Application.SESSION,{}],
	    success: function(response) {
        var wrapped = self.wrapMany(response);
        success(wrapped);
      }
	  });
		db.list("todolist/todos", "lists", params);
	},
	
	/**
	 * Updates a list's data.
	 * @param {String} id A unique id representing your todo.
	 * @param {Object} attrs Data to update your todo with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, doc, success, error ){
	  var self = this;
		db.saveDoc(this.getDocument({
		  _id: doc.id,
		  _rev: doc._rev,
		  title: doc.title,
		  owners: doc.owners
		}), {
		  success: function(response, new_doc) {
		    success(self.transform(new_doc))
		  }
		});
	},
	
	/**
 	 * Destroys a list's data.
 	 * @param {String} id A unique id representing your todo.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, rev, success, error ){
		db.removeDoc({ _id: id, _rev: rev }, {
      success: success
    });
	},
	
	/**
	 * Creates a list.
	 * @param {Object} attrs A todo's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
	  var self = this;
	  
	  // füge sich selbst als owner hinzu, wenn nicht eh schon angegeben
	  if(typeof attrs.owners === "undefined") {
	    attrs.owners = [];
    } else {
      attrs.owners = attrs.owners.split(',');
    }
	  if(attrs.owners.indexOf(Todolist.Controllers.Application.SESSION) === -1) {
	    attrs.owners.push(Todolist.Controllers.Application.SESSION);
	  }
	  
		db.saveDoc(this.getDocument(attrs), {
      success: function(response, new_doc) {
        jQuery.extend(attrs, response);
        success(self.transform(new_doc));
        
        return null;
      }
    });
	}
	
},
/* @Prototype */
{});