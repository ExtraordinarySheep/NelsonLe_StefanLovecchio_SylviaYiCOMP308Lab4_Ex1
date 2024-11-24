module.exports = function (app) {
    const index = require("../controllers/index.server.controller");

    app.get("/", (req, res) => {
        res.send("API is running!");
    });

    app.get("/api/run", index.trainAndPredict);

    app.post("/api/test", index.testNewData);
};
