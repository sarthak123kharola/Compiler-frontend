const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3002;
const cors= require('cors');

const constPath = path.join(__dirname, './uploads');

app.use(cors());
app.use(bodyParser.json());

app.post('/compare-files', (req, res) => {
    const { fileNames } = req.body;

    if (!fileNames || !Array.isArray(fileNames)) {
        return res.status(400).send('Invalid file list.');
    }

    const fullPaths = fileNames.map(fileName => path.join(constPath, fileName));

    const exePath = path.join('D:', 'Compiler frontend', 'cypher', 'temp.exe');
    const process = spawn(exePath, fullPaths);

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
        output += data.toString();
    });

    process.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    process.on('close', (code) => {
        if (code === 0) {
            res.send(output);
        } else {
            console.error('Executable error:', errorOutput);
            res.status(500).send('Error executing comparison.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
