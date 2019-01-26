const request = require('request');

const apiKey = require('../api-keys');

const getWeather = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.darksky.net/forecast/${apiKey.dark_sky}/${latitude},${longitude}`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject(error.message)
            } else if (response.statusCode === 400) {
                reject('Unable to fetch weather info')
            } else if (response.statusCode === 200) {
                resolve({
                    temperature: body.currently.temperature,
                    apparentTemperature: body.currently.apparentTemperature
                });
            }
        });
    });
};

module.exports = {
    getWeather
};