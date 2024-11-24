const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = function () {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors()); 

    require("../app/routes/index.server.routes")(app);

    return app;
};
