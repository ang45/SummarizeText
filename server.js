const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Replace with your Hugging Face API key
const API_KEY = "your_huggingface_api_key";
const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

app.use(bodyParser.json());

app.post('/summarize', async (req, res) => {
    const text = req.body.text;

    if (!text) {
        return res.status(400).json({ error: "No text provided for summarization." });
    }

    try {
        const response = await axios.post(
            API_URL,
            { inputs: text, parameters: { max_length: 130, min_length: 30, do_sample: false } },
            { headers: { Authorization: `Bearer ${API_KEY}` } }
        );

        if (response.data && response.data[0] && response.data[0].summary_text) {
            res.json({ summary: response.data[0].summary_text });
        } else {
            res.status(500).json({ error: "Failed to summarize the text." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
