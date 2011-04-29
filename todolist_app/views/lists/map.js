function(doc) {

  if (doc.type == "list") {
    for(var i in doc.owners) {
      emit([doc.owners[i], doc._id, 0, null], null);
    }
  } else if (doc.type == "todo") {
    for(var i in doc.owners) {
      emit([doc.owners[i], doc.list_id, 1, doc.date], null);
    }
  }

}