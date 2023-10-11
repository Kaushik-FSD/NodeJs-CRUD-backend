const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const port = process.env.PORT || 5000;

// This is used to call the DB connection code
connectDb();
const app = express();

//middleware for body-parser
app.use(express.json());

//Middleware
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes.js"));

/*
    In summary, the errorhandler middleware gets executed when any route handler in your application 
    calls next(err) with an error object. It's a global error handler that catches errors from all routes, 
    including those defined in contactRoutes. This allows you to centralize error handling and provide 
    consistent responses for various types of errors.

    When you pass an error object to next, Express.js recognizes it as an error, and it skips 
    all subsequent route handlers and middleware to find an error-handling middleware.
*/
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at port :: ${port}`);
});
