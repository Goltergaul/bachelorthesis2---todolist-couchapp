$.Controller.extend('Todolist.Controllers.List',
  /* @Static */
  {
    onDocument: false,
    
  	initNewTaskButton: function(el) {
  	  el.button().bind("click", function(ev) {
        var list_id = $(ev.currentTarget).attr("data-list-id");
        Todolist.Controllers.Todo.showCreateDialog(list_id);
      });
  	},
  	
  	initDeleteListButon: function(el) {
  	  $(el).button();
  	}
  	
  },
  /* @Prototype */
  {

    load: function(el, options){
      var self = this;
      
      this.element.html(this.view('init')).find("#accordion").accordion({
        autoHeight: false
      });
      
      Todolist.Models.List.findAll({}, function(lists) {
        self.Class.new_list_dialog = $("#new_list_dialog");
        self.initializeNewListDialog();
    
        for(var i=0;i<lists.length;i++) {
          self.buildListElement(lists[i]);
        }
      });
    },
 
    buildListElement: function( list ) {
      var accordion = this.element.find("#accordion");
      var active = accordion.accordion( "option", "active" );
      accordion.append(this.view('list', {list: list})).accordion('destroy', {autoHeight: false}).accordion({ active: active });
       
      var inserted_list = this.element.find("div.todolist_models_list_"+list.id);
      new Todolist.Controllers.Todo(inserted_list);
      
      Todolist.Controllers.List.initNewTaskButton(inserted_list.find(".DATA-new-task-button"));
      Todolist.Controllers.List.initDeleteListButon(inserted_list.find(".DATA-delete-list-button"));
    },

    initializeNewListDialog: function() {
      
      this.Class.new_list_dialog.find("input[type=submit]").bind("click", function(ev) {
        ev.preventDefault();
        new Todolist.Models.List($(this).closest("form").formParams()).save();
      });
      
      this.Class.new_list_dialog.find("input[name=owners]").tokenInput("/_users/_design/_auth/_list/users/users", {
        hintText: "Gebe Benutzer an, die diese Liste auch bearbeiten können sollen",
        noResultsText: "Kein Benutzer mit diesem Namen vorhanden",
        searchingText: "Suche...",
        theme: "facebook"
      });
      
    },
 
    /**
     * Listens for lists being created.	 When a list is created, displays the new list.
     * @param {String} called The open ajax event that was called.
     * @param {Event} todo The new todo.
     */
    'list.created subscribe': function( called, list ){
      this.buildListElement(list);
    },
    
    /**
     *	 Handle's clicking on a list's destroy link.
     */
    '.DATA-delete-list-button click': function( el ){
      if(confirm("Are you sure you want to destroy?")){
        var list_model = el.closest('.list').model()
        
        // Todos entfernen
        $(".todolist_models_list_"+list_model.id+" .todo").each(function(i, todo) {
          $(todo).model().destroy();
        });

        list_model.destroy();
    	}
    },
    
    /**
     *	 Listens for lists being destroyed and removes them from being displayed.
     */
    "list.destroyed subscribe": function(called, list){
      list.elements().remove();	 //removes ALL elements
    },

    /**
     * Entfernt den angeklickten Owner aus der Liste
     */
    ".owner click": function(el) {
      var removedName = el.text();
      if(Todolist.Controllers.Application.SESSION === removedName) {
        alert("Du kannst dich nicht selbst entfernen!");
        return;
      }
      if(confirm("Soll "+removedName+" wirklich von der Liste entfernt werden?")) {
        var doc = el.closest('.list').model();
        doc.owners.splice(doc.owners.indexOf(removedName), 1);
        doc.update();
        
        // alle Todos updaten (owner entfernen)
        $(".todolist_models_list_"+doc.id+" .todo").each(function(i, todo) {
          $(todo).model().update();
        });
        
        el.remove();
      }
    }
  });