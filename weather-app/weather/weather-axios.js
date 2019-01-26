const axios = require('axios');

const apiKey = require('../api-keys');

const getWeather = (lat, lng) => {
    return axios.get(`https://api.darksky.net/forecast/${apiKey.dark_sky}/${lat},${lng}`);
};

module.exports = {
    getWeather
};
