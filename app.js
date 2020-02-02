var express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config();
const fs = require('fs');
var cors = require('cors')

//connect to db 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("DB connected."));
mongoose.connection.on('error', err => {
  console.log(err.message);
})


//import routes
const post_route = require('./routes/post');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');



app.get('/', (req, res) => {
  fs.readFile('docs/docs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    return res.json(docs);
  });
});

//middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(cors())



app.use('/', post_route);
app.use('/', authRoute);
app.use('/', userRoute);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: "Unauthenticate"
    });
  }
});


//set up server listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

