const request = require('request');

const apiKey = require('../api-keys');

const geocodeAddress = address => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey.google}`,
            json: true
        }, (error, response, body) => {

            if (error) {
                reject(`Unable to connect to Google Servers, please check your internet connection`);
            } else if (body.status === 'ZERO_RESULTS') {
                reject(`Unable to find address ${address}`);
            } else if (body.results.length > 0) {
                resolve({
                    address: body.results[0].formatted_address,
                    latitude: body.results[0].geometry.location.lat,
                    longitude: body.results[0].geometry.location.lng
                });
            }
        });
    });
};

module.exports = {
    geocodeAddress
};