const path = require('path');

const express = require('express');

const port = process.env.PORT || 3000;

const app = express();

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

console.log(publicPath);

app.listen(port, () => {
    console.log(`App started on port ${port}`)
});