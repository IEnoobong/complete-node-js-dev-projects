const axios = require('axios');
const apiKey = require('../api-keys');

const geocodeAddress = address => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey.google}`)
};

module.exports = {
    geocodeAddress
};