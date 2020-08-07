require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const { config, trans } = require('itranslator')
const translations = require('./translations')
const exphbs = require('express-handlebars')
const { insert: insertUser } = require('./repositories/user')
const rateLimit = require("express-rate-limit")

config({ source: translations })

const app = express()
const hbs = exphbs.create()
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/views'))

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const getLang = reqLang => ['ar', 'fr', 'en', 'es'].includes(reqLang) ? reqLang : 'ar'
const maxData = 200

const isEmailvalid = email => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)

app.get('/', (req, res) => {
    const lang = getLang(req.query.lang && req.query.lang.toLowerCase())
    res.render(
        'index',
        {
            helpers:
            {
                trans: s => trans(`${lang}.${s}`),
                isSelectedLang: l => lang === l
            },
            rtl: lang === 'ar',
            lang
        })
})

const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 10,
    message: { message: 'Too many accounts created from this IP, please try later' }
})

app.post('/', limiter, (req, res) => {
    const { email, account_type } = req.body
    const lang = getLang(req.query.lang && req.query.lang.toLowerCase())

    if (req.headers['content-length'] > maxData) {
        res.status(400)
        return res.json({})
    }

    if (!isEmailvalid(email.trim())) {
        res.status(422)
        return res.json({ message: trans(`${lang}.errors.invalidEmail`) })
    }


    insertUser({ email, isPro: account_type === 'pro' }, err => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(409)
                return res.json({ message: trans(`${lang}.errors.${err.code}`, { vars: { email } }) })
            }
            res.status(500)
            return res.json({ message: trans(`${lang}.errors.server`) })
        }
        res.json({ message: trans(`${lang}.success.registration`) })
    })
})

app.use((_, res) => {
    res.status(404)
    res.send('Not found')
})

app.listen(process.env.PORT || 3000)