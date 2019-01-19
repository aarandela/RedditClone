const express = require('express')
const app = express()
const db = require('./server/db')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))

app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
}))

app.set('view engine', '.hbs')

// ROUTES
app.use('/', require('./server/routes/frontpage'))
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/auth'))

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

const port = process.env.PORT || 3000
app.listen(port, () => console.log('App listening on port ' + port))
