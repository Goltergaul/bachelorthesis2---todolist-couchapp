/**
 * @tag models, home
 * Wraps backend todo services.  Enables 
 * [Todolist.Models.Todo.static.findAll retrieving],
 * [Todolist.Models.Todo.static.update updating],
 * [Todolist.Models.Todo.static.destroy destroying], and
 * [Todolist.Models.Todo.static.create creating] todos.
 */
$.Model.extend('Todolist.Models.Todo',
/* @Static */
{
  
  attributes : { 
    descr : 'string',
    date  : 'date',
    id    : 'string',
    _rev   : 'string',
    list_id: 'string',
    status: 'boolean',
    owners: 'array'
  },
  
  associations : {
    blongsTo : "Todolist.Models.List"
  },
  
  hidden_attributes : {
    type  : 'todo'
  },
  
  getDocument : function(attrs) {
    jQuery.extend(attrs, this.hidden_attributes);
    
    // owner wie in liste setzen
    var list_doc = $(".todolist_models_list_"+attrs.list_id).model();
    attrs["owners"] = list_doc.owners;
    
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
    return this.wrap({
        id: row.id,
        _rev: row.doc._rev,
        descr: row.doc.descr,
        date: row.doc.date,
        list_id: row.doc.list_id,
        status: row.doc.status,
        owners: row.doc.owners
      });
  },

	/**
 	 * Retrieves todos data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped todo objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
	  var self = this;
	  jQuery.extend(params, {
	    include_docs: true,
	    success: function(response) {
        var wrapped = self.wrapMany(response.rows);
        success(wrapped);
      }
	  });
		db.view("todolist/todos", params);
	},
	
	/**
	 * Updates a todo's data.
	 * @param {String} id A unique id representing your todo.
	 * @param {Object} attrs Data to update your todo with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, doc, success, error ){
	  var self = this;
		db_write.saveDoc(this.getDocument({
		  _id: doc.id,
		  _rev: doc._rev,
		  descr: doc.descr,
		  date: this.getDate(),
		  list_id: doc.list_id,
		  status: doc.status
		}), {
		  success: function(response, new_doc) {
		    success(self.transform(new_doc))
		  }
		});
	},
	
	/**
 	 * Destroys a todo's data.
 	 * @param {String} id A unique id representing your todo.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, rev , success, error ){
		db_write.removeDoc({ _id: id, _rev: rev }, {
      success: success
    });
	},
	
	/**
	 * Creates a todo.
	 * @param {Object} attrs A todo's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
	  var self = this;
	  
	  // creates date
	  attrs.date = this.getDate();
	  attrs.status = false;
	  
		db_write.saveDoc(this.getDocument(attrs), {
      success: function(response, new_doc) {
        jQuery.extend(attrs, response);
        success(self.transform(new_doc));
        
        return null;
      }
    });
	},
	
	getDate: function() {
	  var date = new Date();
	  return [date.getFullYear(), date.getMonth()+1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
	}
},
/* @Prototype */
{});