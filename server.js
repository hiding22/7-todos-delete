/// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid')
 
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults
db.defaults({ todos: [] }).write()

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/todos", (request, response) => {
	response.render('index', {
		todos: db.get('todos').value()
	});
});	

app.get("/todos/search", (request, response)=> {
	var q = request.query.q;
	var matched = db.get('todos').value().filter(function (todo) {
    	return todo.text.toLowerCase().indexOf(q.toLowerCase()) !== -1; 
	});

	response.render('index', {
    todos: matched
  });
});

app.get("/todos/create", (req, res) => {
	res.render('create');
});

app.get('/todos/:id/delete', (req, res) => {
	var id = req.params.id;

	var todo = db.get('todos').find({ id: id }).value();

	db.get('todos')
	.remove({ id: todo.id })
	.write();
	res.redirect('/todos');
});


app.post("/todos/create", (req, res) => {
	req.body.id = shortid.generate();
	db.get('todos').push(req.body).write();
	res.redirect('/todos');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});

