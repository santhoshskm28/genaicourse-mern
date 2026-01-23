import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = 5002;

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server listening on port', PORT);
});