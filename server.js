var express = require("express");
var exphbs = require("express-handlebars");
var mysql = require("mysql2");

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "arzu1234",
    database: "movie_planner_db"
});


connection.connect(function(err) {
    if (err) {
        console.error("Something went wrong!");
        return;
    }

    console.log("Connected succesfully!");
});

//Routes

app.get('/', (req, res) => {
    connection.query('SELECT * FROM movies', (err, data) => {
        res.render('index', { movies: data })
    })
});

app.post('/api/movies', (req, res) => {
    const newMovieText = req.body.newMovieText;
    console.log(req.body);
    connection.query('INSERT INTO movies (movie) VALUES (?)',
        [newMovieText], (err, response)=> {
        if(err) throw err;
        res.status(200).send();
    })
});

app.put(`/api/movies/:id`, (req, res) => {
    const id = req.params.id;
    const updateMovieText = req.body.updateMovieText;
    connection.query('UPDATE movies SET movie = ? WHERE id = ?',
        [updateMovieText, id],
        (err, result) => {
        if(err) throw err;
        res.status(200).send()

    })
});

app.delete('/api/movies/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM movies WHERE ?', {id}, (err, result)=>{
        if(err) throw err;
        res.status(200).send();
    })
});

app.listen(5500);