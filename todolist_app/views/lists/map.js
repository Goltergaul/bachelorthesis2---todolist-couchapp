function(doc) {

  if (doc.type == "list") {
    emit([doc._id, 0, null], null);
  } else if (doc.type == "todo") {
    emit([doc.list_id, 1, doc.date], null);
  }

}