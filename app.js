/** Shopping List Express app. */
const express = require("express");
const app = express();
const morgan = require("morgan");

const itemRoutes = require("./itemRoutes");
//const middleware = require("./middleware");

const { NotFoundError } = require("./expressError");

// process JSON body => req.body
app.use(express.json());

// process traditional form data => req.body
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use("/items", itemRoutes);



/** 404 NOT FOUND handler: logs stacktrace and returns JSON error message. */ 
app.use(function (req, res, next) {
    throw new NotFoundError();
  });
  
  
/** Error handler: logs stacktrace and returns JSON error message. */ 
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message;
  
    //when testing with JEST don't show the stack trace
    if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
    return res.status(status)
              .json({ error: { message, status } });
});
  


module.exports = app;