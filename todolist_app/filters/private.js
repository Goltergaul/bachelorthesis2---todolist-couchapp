function(doc, req) {
  // synchronisiere alle dateien die dem Benutzer gehören und alle Design Dokumente
  if (doc._id.match("_design")) return true;
  
  if (!doc.owners) return false;
  if (doc.owners.indexOf( req.query.user ) !== -1) return true;
  
  return false;
}