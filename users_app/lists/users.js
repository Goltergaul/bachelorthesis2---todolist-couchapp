function(head, req) {
  var returnObj = [];
  log(req);
  var regex = new RegExp(req.query.q.match(/[a-zA-Z0-9]+/),"i");
  while (row = getRow()) {
    if(row.key.match(regex)) {
      returnObj.push({
        id: row.key,
        name: row.key
      });
    }
  }

  send(JSON.stringify(returnObj));

}