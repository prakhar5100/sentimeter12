const express = require('express');
const { PythonShell } = require('python-shell');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const {url} = req.body;
  console.log(url)
  try {
    const options = {
      mode: 'text',
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, 'scripts'),
      args: [url]
    };

    PythonShell.run('./sentiment_analysis.py', options).then(results => {
      console.log('Run')
      const {analysis, reviews, insights, imageURL, title} = JSON.parse(results[results.length - 1]);
      res.json({analysis, reviews, insights, imageURL, title});
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze reviews' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
