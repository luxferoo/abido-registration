const mysql = require('mysql')

const createConnection = () => mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

module.exports = {
    insert: ({ email, isPro, phone }, cb = () => { }) => {
        const con = createConnection()
        const sql = `INSERT INTO users (email, isPro, phone) VALUES(?,?,?)`
        const values = [email.trim(), isPro, phone.trim()]
        con.query(sql, values, (err, results, fields) => {
            if (err) return cb(err)
            cb(null, results)
        })
        con.end()
    }
}
