const request = require('request');

const apiKey = require('../api-keys');

const getWeather = (latitude, longitude, callback) => {
    request({
        url: `https://api.darksky.net/forecast/${apiKey.dark_sky}/${latitude},${longitude}`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback(error.message)
        } else if (response.statusCode === 400) {
            callback('Unable to fetch weather info')
        } else if (response.statusCode === 200) {
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        }
    });
};

module.exports = {
    getWeather
};