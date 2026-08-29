const express = require('express');
const dotenv = require('dotenv');
const cors  = require('cors');
const app = express();
const healthcheckRouter = require('./routes/healthcheck');
const coachesRouter = require('./routes/api/coaches');


app.use(cors());
app.use(express.json());
app.use('/healthcheck', healthcheckRouter);
app.use('/api/coaches',coachesRouter);

module.exports = app