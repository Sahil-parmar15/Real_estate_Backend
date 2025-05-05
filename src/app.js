const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

const authRouter = require('./routes/auth.route');
app.use('/api/v1/auth', authRouter);

const superadminRouter = require('./routes/superadmin.route');
app.use('/api/v1/superadmin', superadminRouter);


app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: err.errors || [],
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  });
module.exports = app;
