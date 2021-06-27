const sql = require('mysql')
const express = require('express');
const bodyParser = require('body-parser');
// const { rows } = require('mssql');
const app = express()
const cors = require('cors')
const auth = require('./middleware/auth.js')
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vincent'
})
con.connect(function(err) {
    if (err) console.log(err);
    else console.log("Connected!")
})
app.get('/', (req, res) => {
    res.send(`<html><div><form method="post" action="/todo"><input type="text" name="kode"/><button type="submit">Add</button></div></form></html>`)
})
app.post('/todo', auth, (req, res) => {
    var data = req.body.Deskripsi
    var sqll = "INSERT INTO waktu(Deskripsi) VALUES ('" + data + "')"
    con.query(sqll, data, function(err, data1) {
        if (err) throw err;
        console.log("User Data has inserted!")
    })
    res.end()
})
app.get('/todo', auth, (req, res) => {
    con.query("SELECT * from waktu", (err, rows, field) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })
})
app.delete('/todo/:id', auth, (req, res) => {
    con.query("DELETE FROM waktu WHERE ID = '" + req.params.id + "'")
    res.end()
})
app.get('/user', auth, (req, res) => {
    con.query("SELECT ID, username FROM user", (err, rows, field) => {
        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }
    })
})
app.post('/user', (req, res) => {
    const user = req.body.username
    const password = req.body.password
    con.query('INSERT INTO user (username, password) VALUES(?,?)', [user, password], function(err, rows, fields) {
        if (err) {
            res.end(500)
            return
        }
    })
    con.query('SELECT ID, username FROM user ORDER BY ID DESC LIMIT 1', (err, rows, fields) => {
        res.send(rows)
    })
})

app.delete('/user/:id', auth, function(req, res) {
    con.query('SELECT COUNT(*) as jumlahuser FROM user', function(err, results) {
        var data = Object.values(results)
        if (data[0].jumlahuser > 1) {
            con.query("DELETE FROM user WHERE ID = '" + req.params.id + "'")
            res.end("Terhapus")
        } else {
            res.send(401)
        }
    })
})
app.listen(3000);