import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [currentInput, setCurrentInput] = useState({
        sepal_length: "",
        sepal_width: "",
        petal_length: "",
        petal_width: "",
    });
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState(null);
    const [epochs, setEpochs] = useState(100);
    const [learningRate, setLearningRate] = useState(0.06);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentInput({ ...currentInput, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (Object.values(currentInput).some((val) => val === "")) {
            setError("All fields must be filled.");
            return;
        }

        const payload = {
            testInputs: [
                {
                    sepal_length: parseFloat(currentInput.sepal_length),
                    sepal_width: parseFloat(currentInput.sepal_width),
                    petal_length: parseFloat(currentInput.petal_length),
                    petal_width: parseFloat(currentInput.petal_width),
                },
            ],
            epochs: parseInt(epochs),
            learningRate: parseFloat(learningRate),
        };

        try {
            const response = await axios.post("http://localhost:5000/api/test", payload);
            setPredictions((prevPredictions) => [...prevPredictions, ...response.data.predictions]);
            setCurrentInput({ sepal_length: "", sepal_width: "", petal_length: "", petal_width: "" });
        } catch (eputrr) {
            console.error(err);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="app-container">
            <h1>Iris Prediction</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="input-group">
                    <input
                        type="text"
                        name="sepal_length"
                        value={currentInput.sepal_length}
                        onChange={handleInputChange}
                        placeholder="Sepal Length"
                    />
                    <input
                        type="text"
                        name="sepal_width"
                        value={currentInput.sepal_width}
                        onChange={handleInputChange}
                        placeholder="Sepal Width"
                    />
                    <input
                        type="text"
                        name="petal_length"
                        value={currentInput.petal_length}
                        onChange={handleInputChange}
                        placeholder="Petal Length"
                    />
                    <input
                        type="text"
                        name="petal_width"
                        value={currentInput.petal_width}
                        onChange={handleInputChange}
                        placeholder="Petal Width"
                    />
                </div>
                <div className="parameter-container">
                    <input
                        type="number"
                        name="epochs"
                        value={epochs}
                        onChange={(e) => setEpochs(e.target.value)}
                        placeholder="Number of Epochs"
                    />
                    <input
                        type="number"
                        name="learningRate"
                        value={learningRate}
                        onChange={(e) => setLearningRate(e.target.value)}
                        placeholder="Learning Rate"
                        step="0.01"
                    />
                </div>
                <button type="submit" className="test-button">
                    Test Model
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}

            {predictions.length > 0 && (
                <div className="results-container">
                    <h2>Prediction Results</h2>
                    <table className="results-table">
                        <thead>
                            <tr>
                                {predictions.map((_, index) => (
                                    <th key={index}>Test {index + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {predictions.map((prediction, index) => (
                                    <td key={index}>{prediction}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>

                    <h3>Definition of Values for Species</h3>
                    <table className="species-table">
                        <thead>
                            <tr>
                                <th>Species</th>
                                <th>Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>setosa</td>
                                <td>1, 0, 0</td>
                            </tr>
                            <tr>
                                <td>virginica</td>
                                <td>0, 1, 0</td>
                            </tr>
                            <tr>
                                <td>versicolor</td>
                                <td>0, 0, 1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
