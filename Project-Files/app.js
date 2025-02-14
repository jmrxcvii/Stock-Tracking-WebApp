//server file
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mysql = require('mysql');

//function that grabs all stocks from database 
function stockGrab(callback) {
	const con = mysql.createConnection({
	host: '34.148.101.4',
	user: 'team3',
	password: 'csc330Team3',
	database: 'stockDB'
	});
	let stocks = [];
	con.connect(function(err) {
		if (err) throw err;
		con.query('select * from stocks', function(err, results) {
			if (err) throw err;
			for (let i=0;i<results.length;i++) {stocks.push({id:results[i].stock_id,company:results[i].company,symbol:results[i].symbol});};
			con.end();
			return callback(stocks);
		});
	});
}

//function that grabs prices for a stock
function priceGrab(company, res) {
	const con = mysql.createConnection({
        host: '34.148.101.4',
        user: 'team3',
        password: 'csc330Team3',
        database: 'stockDB'
        });
	let prices = [];
	con.connect(function(err) {
		if (err) throw err;
		con.query('select * from price where stock_id = (select stock_id from stocks where company = "'+company.company+'")', function(err, results) {
			if (err) throw err;
			for (let i=0;i<results.length;i++) {prices.push({price:results[i].price});};
			con.end();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(prices));
        		res.end();
		});
	});
}

// function that grabs and returns password from databse back to client
function login(user, res) {
	const con = mysql.createConnection({
        host: '34.148.101.4',
        user: 'team3',
        password: 'csc330Team3',
        database: 'stockDB'
        });
	con.connect(function(err) {
		if (err) throw err;
		con.query('select password from users where username = "'+user.user+'"', function(err, results) {
			if (err) { throw err;
			} else if (results.length == 0) {
				con.end();
				res.writeHead(400, { 'Content-Type': 'text/plain' });
                        	res.write('query error');
                        	res.end();
			} else {
				let pass = results[0].password;
				con.end();
				res.writeHead(200, { 'Content-Type': 'application/json' });
                        	res.write(JSON.stringify(pass));
				res.end();
			}
		});
	});
}

// function that registers a new user
function register(query, res) {
        const con = mysql.createConnection({
        host: '34.148.101.4',
        user: 'team3',
        password: 'csc330Team3',
        database: 'stockDB'
        });
        con.connect(function(err) {
                if (err) throw err;
                con.query('insert into users values ("'+query.username+'","'+query.password+'")', function(err, results) {
                        if (err) {
                                con.end();
                                res.writeHead(400, { 'Content-Type': 'text/plain' });
                                res.write('query error');
                                res.end();
                        } else {
                                con.end();
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.write('success');
                                res.end();
                        }
                });
        });
}


// function that saves stocks to a list in database
function save(query, res) {
        const con = mysql.createConnection({
        host: '34.148.101.4',
        user: 'team3',
        password: 'csc330Team3',
        database: 'stockDB'
        });
        con.connect(function(err) {
                if (err) throw err;
                con.query('insert into list values("'+query.user+'",(select stock_id from stocks where company ="'+query.stock+'"))', function(err, results) {
                        if (err) {
				con.end();
                                res.writeHead(400, { 'Content-Type': 'text/plain' });
                                res.write('query error');
                                res.end();
			} else {
				con.end();
                        	res.writeHead(200, { 'Content-Type': 'text/plain' });
                        	res.write('Stock saved');
                        	res.end();
			}
                });
        });
}

// function that deletes stocks from a list in database
function del(query, res) {
        const con = mysql.createConnection({
        host: '34.148.101.4',
        user: 'team3',
        password: 'csc330Team3',
        database: 'stockDB'
        });
        con.connect(function(err) {
                if (err) throw err;
                con.query('delete from list where username="'+query.user+'" and stock_id = (select stock_id from stocks where company ="'+query.stock+'")', function(err, results) {
                        if (err) {
                                con.end();
                                res.writeHead(400, { 'Content-Type': 'text/plain' });
                                res.write('query error');
                                res.end();
                        } else {
                                con.end();
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.write('Stock deleted');
                                res.end();
                        }
                });
        });
}

// function that collects stocks saved to a list in database
function listGrab(query, res) {
        const con = mysql.createConnection({
        host: '34.148.101.4',
        user: 'team3',
        password: 'csc330Team3',
        database: 'stockDB'
        });
        let list = [];
        con.connect(function(err) {
                if (err) throw err;
                con.query('select company from stocks where stock_id in (select stock_id from list where username = "'+query.user+'")', function(err, results) {
                        if (err) throw err;
                        for (let i=0;i<results.length;i++) {list.push({company:results[i].company});};
                        con.end();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(list));
                        res.end();
                });
        });
}

//read a file from specified filepath and send the content as a response
//if the file is not found then a message is sent saying so
function sendResponse(res, filePath) {
	fs.readFile(filePath, function(err, data) {
	  if (err) {
		    res.writeHead(404, {'Content-Type': 'text/plain' });
		    res.end('File Not Found');
	  } else {
	      const contentType = getContentType(filePath);
	      res.writeHead(200, {'Content-Type' : contentType });
	      res.write(data);
	      res.end();
	 }
    });
}

//returns the content type based on the file extension provided by the filePath 
//and by default html is for unrecognized extensions
function getContentType(filePath) {
	const fileExt = path.extname(filePath).toLowerCase();
	switch (fileExt){
	  case '.txt':
	       return 'text/plain';
	  case '.js':
	       return 'application/javascript';
	  case '.css':
	       return 'text/css';
	  case '.jpeg':
	  case '.jpg':
               return 'image/jpeg';
	  case '.png':
               return 'image/png'; 
	  default:
	       return 'text/html';
	}
}

//this function will check to see if has the company parameter and then it searches
//for the data related to the specified company in the json format but if company is 
//missing then it returns error
function processQuery(query, res) {
    if (query.company) {
        const searchTerm = query.company.toLowerCase();
        let results = '';
	stockGrab(function(result) {
		results = result.filter((company) =>
                company.company.toLowerCase().startsWith(searchTerm) ||
                company.symbol.toLowerCase().startsWith(searchTerm)
                );
        	res.writeHead(200, { 'Content-Type': 'application/json' });
        	res.end(JSON.stringify(results));
	});
    } else if (query.company=='') {
	      stockGrab(function(result) {
		      results = result;
        	res.writeHead(200, { 'Content-Type': 'application/json' });
        	res.end(JSON.stringify(results));
	});
    } else {
	res.writeHead(400, {'Content-Type': 'text/html' });
	res.end('Invail query');
    }
}

//listens to incoming requests and if the path is /search then 
//it uses the processQuery function but if the path is anything else then
//it attempts to send a response based on the file located at the path in public_html directory
const server = http.createServer(function (req, res) {
    console.log(req.url);
    const parsedUrl = url.parse(req.url, true);
    const pathname = path.join('public_html', parsedUrl.pathname);

    if (parsedUrl.pathname === '/search') {
        processQuery(parsedUrl.query, res);
    } else if (parsedUrl.pathname == '/price') {
	      priceGrab(parsedUrl.query,res);
    } else if (parsedUrl.pathname == '/login') {
	      login(parsedUrl.query, res);
    } else if (parsedUrl.pathname == '/register') {
              register(parsedUrl.query, res);
    } else if (parsedUrl.pathname == '/save') {
		save(parsedUrl.query, res);
    } else if (parsedUrl.pathname == '/list') {
		listGrab(parsedUrl.query, res);
    } else if (parsedUrl.pathname == '/delete') {
		del(parsedUrl.query, res);
    } else if (parsedUrl.pathname == '/') {
        sendResponse(res, 'public_html/frontPage.html');
    } else {
        sendResponse(res, pathname);
    }
});

//start the http server and listen on port 80
server.listen(80, function(){
	console.log("server is listening on port 80");
});
