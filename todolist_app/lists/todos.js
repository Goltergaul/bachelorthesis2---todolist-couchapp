function(head, req) {
  
  if(!req.query.startkey || !req.query.endkey || req.query.startkey[0] !== req.query.endkey[0]) {
    send("Ungültige Anfrage. Bitte Start- und Endkey angeben.");
    return;
  }
  
  var returnObj = [];
  while (row = getRow()) {
    
    if(row.key[2] == 0) {
      // prüfen ob der Benutzer Zugriff auf diese Liste hat
      if(row.doc.owners.indexOf(req.userCtx.name) === -1) continue;
      
      var list = {};
      list.id = row.doc._id;
      list.doc = row.doc;
      list.doc.todos = [];
      returnObj.push(list);
    } else {
      // wenn listenobject nicht initialisiert oder die ids nicht übereinstimmen, dann todo auslassen
      if(!list || list.id !== row.doc.list_id) continue;
      list.doc.todos.push({ 
        id:row.doc._id,
        doc: row.doc
      });
    }
    
  }

  send(JSON.stringify(returnObj));

}