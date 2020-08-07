const mysql = require('mysql')
require('dotenv').config()

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
})

con.connect(err => {
    if (err) throw err
    con.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} character set UTF8 collate utf8_bin`, async (err, result) => {
        if (err) throw err
        try {
            await con.query(`USE ${process.env.DB_NAME}`)
            await con.query(`CREATE TABLE IF NOT EXISTS users (
                   id int NOT NULL AUTO_INCREMENT,
                   email varchar(50) NOT NULL UNIQUE,
                   isPro tinyint(1) DEFAULT 0,
                   PRIMARY KEY (id)
        )`)
        } catch (error) {
            console.log(error)
        }
        con.end(() => console.log('database closed'))
    })
})