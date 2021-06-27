const sql = require('mysql');
const con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vincent'
})

module.exports = function(req, res, next) {
    const username = req.headers.username
    const password = req.headers.password

    con.query('SELECT username FROM user WHERE username=? AND password=?', [username, password], function(err, result) {
        if (result.length > 0) {
            next()
        } else {
            res.send(401)
        }
    })
}