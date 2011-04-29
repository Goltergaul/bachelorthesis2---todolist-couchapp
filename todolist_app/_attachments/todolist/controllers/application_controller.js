$.Controller.extend('Todolist.Controllers.Application',
/* @Static */
{
  onDocument: true,
  LOGOUT: "logout",
  LOGIN: "login",
},
/* @Prototype */
{
 /**
 * When the page loads, initialize the application
 */
  load: function(){
    var self = this;
    this.LOGIN_STATE = Todolist.Controllers.Application.LOGOUT
    
    // view initialisieren
    $('body').html(this.view('layout'));
    
    $("#header").buttonset();
    $("#logout_button").button("disable");
    
    $("#logout_button").bind("click", function(el) {
      Todolist.Models.User.logout(function() {
        self.switchLoginState();
      });
    });
    
    this.initializeNewTodoDialog();
    this.initializeSignUpDialog();
    this.initializeSignInDialog();
    
    new Todolist.Controllers.List($("#todolist"));
    
    // logout bei start der Applikation, da wir das klartext Passwort benötigen
    Todolist.Models.User.logout();
  },
  
  initializeNewTodoDialog: function() {
    this.Class.new_todo_dialog = $("#new_todo_dialog");
    this.newDialog(this.Class.new_todo_dialog, null, "Neuen Task anlegen", function(ev) {
      ev.preventDefault();

      var values = {
        descr: $(this).closest("form").find("input[name=descr]").val(),
        list_id: Todolist.Controllers.Todo.current_list_id
      }
      new Todolist.Models.Todo(values).save();
    });
  },
  
  initializeSignUpDialog: function() {
    var self = this;
    this.Class.sign_up_dialog = $("#sign_up_dialog"); 
    
    this.newDialog(this.Class.sign_up_dialog, $("#register_button"), "SignUp", function(ev) {
      ev.preventDefault();

      var sign_up_form = $(ev.currentTarget).closest("form");
      new Todolist.Models.User(sign_up_form.formParams()).save();
    });
  },
  
  initializeSignInDialog: function() {
    var self = this;
    this.Class.sign_in_dialog = $("#sign_in_dialog"); 
    
    this.newDialog(this.Class.sign_in_dialog, $("#login_button"), "SignIn", function(ev) {
      ev.preventDefault();

      var sign_in_form_params = $(ev.currentTarget).closest("form").formParams();
      new Todolist.Models.User(sign_in_form_params).login(function(response) {
        if(response === 401) {
          alert("Login fehlgeschlagen!");
        } else {
          self.Class.SESSION_PW = sign_in_form_params.password;
          self.switchLoginState(response.name);
          self.Class.sign_in_dialog.dialog("close");
        }
      });
    });
  },
  
  newDialog: function(el, opener_el, title, callback) {
    el.find("input[type=submit]").bind("click", callback);
    
    el.dialog({
      autoOpen: false,
      modal: true,
      title: title
    });
    
    if(opener_el) {
      opener_el.bind("click", function() {
        el.dialog("open");
      });
    }
  },
  
  switchLoginState: function(username) {
    if(this.LOGIN_STATE === Todolist.Controllers.Application.LOGIN) {
      // das ist der Status für ausgeloggte Benutzer
      $("#logout_button").button("disable");
      $("#login_button").button("enable");
      $("#register_button").button("enable");
      this.LOGIN_STATE = Todolist.Controllers.Application.LOGOUT;
      this.Class.SESSION = null;
      
      // Listen entfernen
      $("#todolist").children().remove();
    } else {
      // Status für eingeloggte User
      $("#logout_button").button("enable");
      $("#login_button").button("disable");
      $("#register_button").button("disable");
      this.LOGIN_STATE = Todolist.Controllers.Application.LOGIN;
      this.Class.SESSION = username;
      
      // Todolisten Controller initialisieren --> läd die Listen
      $("#todolist").controller().load();
    }
  },
  
  'user.created subscribe': function( called, user ){
    this.Class.sign_up_dialog.dialog("close");
    alert("Anmeldung erfolgreich! Du kannst dich nun einloggen.");
  }

});