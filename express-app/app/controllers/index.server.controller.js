const tf = require("@tensorflow/tfjs");
const iris = require("../../iris.json");
const irisTesting = require("../../iris-testing.json");

exports.trainAndPredict = function (req, res) {
    const trainingData = tf.tensor2d(
        iris.map((item) => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width,
        ])
    );

    const outputData = tf.tensor2d(
        iris.map((item) => [
            item.species === "setosa" ? 1 : 0,
            item.species === "virginica" ? 1 : 0,
            item.species === "versicolor" ? 1 : 0,
        ])
    );

    const testingData = tf.tensor2d(
        irisTesting.map((item) => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width,
        ])
    );
l
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: "relu" }));
    model.add(tf.layers.dense({ units: 10, activation: "relu" }));
    model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

    model.compile({
        optimizer: tf.train.adam(0.06),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
    });

    async function run() {
        try {
            await model.fit(trainingData, outputData, { epochs: 100 });

            const results = model.predict(testingData);
            const predictions = await results.array();

            const mappedPredictions = predictions.map((row) => {
                const highestProbIndex = row.findIndex((val) => val === Math.max(...row));
                return ["setosa", "virginica", "versicolor"][highestProbIndex];
            });

            res.status(200).send(mappedPredictions);
        } catch (error) {
            console.error("Error during training and prediction:", error);
            res.status(500).send({ error: "An error occurred during training." });
        }
    }

    run();
};


exports.testNewData = async function (req, res) {
    const { testInputs, epochs, learningRate } = req.body;

    if (!testInputs || !epochs || !learningRate) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    const trainingData = tf.tensor2d(
        iris.map((item) => [
            item.sepal_length,
            item.sepal_width,
            item.petal_length,
            item.petal_width,
        ])
    );

    const outputData = tf.tensor2d(
        iris.map((item) => [
            item.species === 'setosa' ? 1 : 0,
            item.species === 'virginica' ? 1 : 0,
            item.species === 'versicolor' ? 1 : 0,
        ])
    );

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

    model.compile({
        optimizer: tf.train.adam(parseFloat(learningRate)),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    await model.fit(trainingData, outputData, { epochs: parseInt(epochs) });

    const testData = tf.tensor2d(
        testInputs.map((input) => [
            parseFloat(input.sepal_length),
            parseFloat(input.sepal_width),
            parseFloat(input.petal_length),
            parseFloat(input.petal_width),
        ]),
        [testInputs.length, 4] 
    );

    const predictions = model.predict(testData);
    const predictedArray = await predictions.array();

    const result = predictedArray.map((row) => {
        const highestProbIndex = row.findIndex((val) => val === Math.max(...row));
        return ['setosa', 'virginica', 'versicolor'][highestProbIndex];
    });

    res.json({ predictions: result });
};
