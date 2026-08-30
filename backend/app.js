const express = require('express');
const dotenv = require('dotenv');
const cors  = require('cors');
const app = express();
const healthcheckRouter = require('./routes/healthcheck');
const coachesRouter = require('./routes/api/coaches');
const creditPackage = require('./routes/api/credit-package');
const usersRouter = require('./routes/api/users');
const adminRouter = require('./routes/api/admin');
const coursesRouter = require('./routes/api/courses');

app.use(cors());
app.use(express.json());
app.use('/healthcheck', healthcheckRouter);
app.use('/api/coaches',coachesRouter);
app.use('/api/credit-package',creditPackage);
app.use('/api/users',usersRouter);
app.use('/api/admin/coaches',adminRouter);
app.use('/api/courses', coursesRouter);

module.exports = app