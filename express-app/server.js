process.env.NODE_ENV = process.env.NODE_ENV || "development";

const configureExpress = require("./config/express");
const app = configureExpress();

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000/");
});

module.exports = app;
