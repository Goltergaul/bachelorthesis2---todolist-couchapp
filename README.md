## Todolist example CouchApp

CouchApps are web applications which can be served directly from [CouchDB](http://couchdb.apache.org). 
[More info about CouchApps here.](http://couchapp.org)

This applikation demonstrates authentification, write- and readautorisation. Three different readautorisation-approches where implemented. You can find them in the branches "encryption", "per-user-database" and "proxy-lists". It consists out of two Couchapps, todolist_app and users_app. Both need to be deployed.

## Deploying this app

Define an admin for CouchDB so that it's not running an Admin Party.

Change into the app directory in your terminal, and push it to your CouchDB with the CouchApp command line tool, like this:

    couchapp push

Do this with both apps. You'll need to configure your admin credentials in the .couchapprc files first. 

To visit the app, navigate to http://localhost:5984/todolist(public)/_design/todolist/todolist/todolist.html

## Branches
If you deploy the code of any of the three branches, there are some extra setup steps to follow:

### Per-User-Database
You'll need an Apache2 server with mod_rewirte, mod_proxy enabled and PHP. Create a VirtualHost like this one:

    <VirtualHost *:80>
	    DocumentRoot /home/gaul/AptanaWorkspace/todolist/www
	    ServerName todolist.localhost.de

	    RewriteEngine on

	    RewriteCond %{REQUEST_URI} ^/couch/_replicate.*$
	    RewriteRule ^/(.*)$ proxy:http://todolist.localhost.de/404.html

	    ProxyPass /couch http://localhost:5984

	    <Location /couch/todolist(master)>
		    <LimitExcept POST PUT>
			    order deny,allow
			    deny from all
		    </LimitExcept> 
	    </Location>
    </VirtualHost>

Now create an additional CouchDB Database named "todolist(master)" and replicate once from "todolist(public)" in "todolist(master)"

To visit the app, navigate to http://todolist.localhost.de/couch/todolist(public)/_design/todolist/todolist/todolist.html

### Proxy-Lists
You'll ned an Apache2 server with mod_rewrite. Create a VirtualHost like this one:

    <VirtualHost *:80>
	    ServerName todolist.localhost.de

	    RewriteEngine on

	    RewriteCond %{THE_REQUEST} ^DELETE|POST|PUT\ /.*$|^GET\ /todolist\(public\)/_design/todolist/(static|_list).*$|^GET\ /(_session|_users)
	    RewriteRule ^/(.*)$ proxy:http://localhost:5984/$1

    </VirtualHost>

To visit the app, navigate to http://todolist.localhost.de/todolist(public)/_design/todolist/static/todolist/todolist.html

### Encryption
No additional software needed.

To visit the app, navigate to http://localhost:5984/todolist(public)/_design/todolist/todolist/todolist.html
