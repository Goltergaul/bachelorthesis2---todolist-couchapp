/**
 * @tag controllers, home
 * Displays a table of todos.	 Lets the user 
 * ["Todolist.Controllers.Todo.prototype.form submit" create], 
 * ["Todolist.Controllers.Todo.prototype.&#46;edit click" edit],
 * or ["Todolist.Controllers.Todo.prototype.&#46;destroy click" destroy] todos.
 */
$.Controller.extend('Todolist.Controllers.Todo',
/* @Static */
{
  onDocument: false,
	
	showCreateDialog: function(list_id) {
	  this.current_list_id = list_id;
	  Todolist.Controllers.Application.new_todo_dialog.dialog("open");
	}
},
/* @Prototype */
{
  /**
   * Listens for todos being created.	 When a todo is created, displays the new todo.
   * @param {String} called The open ajax event that was called.
   * @param {Event} todo The new todo.
   */
  'todo.created subscribe': function( called, todo ){
    if(typeof this.element.model() === "undefined" || todo.list_id !== this.element.model().id) {
      return;
    }
  	this.element.find("hr").before( this.view("show", {todo: todo}) );
  	$("input[type!=submit]").val(""); //clear old vals
  },
  
  /*
   *	 Handle's clicking on a todo's destroy link.
   */
  '.destroy click': function( el ){
    if(confirm("Are you sure you want to destroy?")){
      el.closest('.todo').model().destroy();
  	}
  },
   
  /**
   * Updates da todo
   * @param {jQuery} el The todo's done checkbox
   */
  '.checkbox_done click': function( el ){
  	var todo = el.closest('.todo').model();
  	todo.attr("status", el.is(":checked"));
  	todo.update(todo.attrs());
  },
 
  /**
   *	 Listens for todos being destroyed and removes them from being displayed.
   */
  "todo.destroyed subscribe": function(called, todo){
    todo.elements().remove();	 //removes ALL elements
  }
});