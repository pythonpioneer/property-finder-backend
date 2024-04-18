// importing requirements
const connectToMongo = require('./database');
const express = require('express');
const cors = require("cors");
const { PORT, APIPATH } = require('./constants');
const { urlencoded } = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


// connecting with mongodb atlas server
connectToMongo();

// development environment specifications
const app = express();

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
}));

// to check the health of the system
app.use(`${APIPATH}/health`, (_, res) => {
    return res.status(200).json({ status: 200, message: "Server is up and running!" });
});

// all available routes for the API, path: /api/v1
app.use(`${APIPATH}/user`, require('./routes/user'));
app.use(`${APIPATH}/property`, require('./routes/property'));

// executing the app
app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
});