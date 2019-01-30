const path = require('path');

const procfilePath = path.join(__dirname, '..', 'Procfile');
process.env.PROCFILE = procfilePath;

console.log(`Procfile Path ${process.env.PROCFILE}`);