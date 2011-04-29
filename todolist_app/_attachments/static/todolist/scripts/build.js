//steal/js todolist/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('todolist/scripts/build.html',{to: 'todolist'});
});
