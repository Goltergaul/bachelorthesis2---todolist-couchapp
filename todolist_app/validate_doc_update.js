function (newDoc, oldDoc, userCtx) {

  // zählt Attribute eines Objekts
  function keyCount(object) {
    var count = 0;
    for(var field in object) {
      if(field === "_rev" || field === "_id" || field === "_revisions") {
        continue;
      }
      count++;
    }
    
    return count;
  }
  
  // Die  original typeof Funktion ist unbrauchbar für Arrays
  function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length')) && typeof value.splice === 'function') {
          s = 'array';
        }
      } else {
        s = 'null';
      }
    }
    return s;
  }

  // Stellt sicher, dass alle und nicht mehr als die übergebenen Felder im richtigen Format vorliegen
  function require(fields) {
    for(var field in fields) {
      
      var type = fields[field].type;
      var message = fields[field].message || "Dokument muss ein " + field + "-Feld vom Datentyp " + type + " haben!";
      
      if (typeof newDoc[field] === "undefined") throw({forbidden : message});
      
      if(type && typeOf(newDoc[field]) !== type) {
        throw({forbidden : message});
      }
      
    }
    
    if(keyCount(fields) !== keyCount(newDoc)) {
      throw({forbidden : "Zu viele Einträge in diesem Dokument!"});
    }
  }
  
  // Ist eine BenutzerIn Authentifiziert?
  if(!userCtx.name) throw({forbidden: "Authentifizierung notwendig!"});
  
  // Besitzt die BenutzerIn dieses Dokument?
  if(oldDoc && oldDoc.owners.indexOf(userCtx.name) === -1) {
    throw({forbidden: "Du besitzt dieses Dokument nicht!"});
  }

  // Betrifft Ändern und Erstellen eines Dokuments
  if(typeof newDoc._deleted === "undefined") {
    
    // Aufgaben Dokumente
    if (newDoc.type === "todo") {
      require({
        descr: { type: "string" },
        date: { type: "array" },
        list_id: { type: "string" },
        status: { type: "boolean" },
        owners: { type: "array" },
        type: { type: "string" }
      });
      
    // Todolisten Dokumente
    } else if (newDoc.type === "list") {
      require({
        title: { type: "string" },
        owners: { type: "array" },
        type: { type: "string" }
      });
    } else {
      
      // Andere Dokumenttypen werden nicht zugelassen
      throw({forbidden: "Ungülitiger Dokumententyp!"});
    }
    
  }
  
}