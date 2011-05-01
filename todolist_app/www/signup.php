<?php

  /**
   * Erstellt einen Benutzer und eine eigene Datenbank für Ihn.
   * Der Benutzer bekommt leserechte für diese Datenbank und eine
   * Replication von der Master Datenbank zu dieser wird in Gang
   * gesetzt.
   */

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchAdmin.php";
  require_once "lib/couchReplicator.php";
  
  $username = $_POST["name"];
  $password = $_POST["password"];
  $user_db_name = $username."(private)";
  
  $errors = array();
  
  $client = new couchClient("http://admin:0815@localhost:5984/",$user_db_name);
  $admin = new couchAdmin($client);
  
  if(couchClient::isValidDatabaseName($user_db_name)) {
    try {
      $admin->createUser($username,$password);
      $client->createDatabase();
      $admin->addDatabaseReaderUser($username);
      $replicator = new couchReplicator($client);
      $replicator->continuous()
                 ->query_params(array("user" => $username))
                 ->filter("todolist/private")
                 ->from("todolist(master)");
    } catch ( Exception $e ) {
      $errors[] = $e->getMessage();
    }
  } else {
    $errors[] = "Der Benutzername enthält ungültige Zeichen (only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed)";
  }
  
  if(count($errors) > 0) {
    header('Not Acceptable', true, 406);
    echo json_encode($errors);
  }
?>