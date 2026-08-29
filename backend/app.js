const express = require('express');
const dotenv = require('dotenv');
const cors  = require('cors');
const app = express();
const healthcheckRouter = require('./routes/healthcheck');
const coachesRouter = require('./routes/api/coaches');
const creditPackage = require('./routes/api/credit-package')

app.use(cors());
app.use(express.json());
app.use('/healthcheck', healthcheckRouter);
app.use('/api/coaches',coachesRouter);
app.use('/api/credit-package',creditPackage);

module.exports = app