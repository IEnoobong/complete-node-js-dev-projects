const argv = require('./config');
const geocode = require('./geocode/geocode-axios');
const weather = require('./weather/weather-axios');

geocode.geocodeAddress(argv.address).then(response => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find that address');
    }

    const address = response.data.results[0].formatted_address;
    console.log(address);

    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;

    return weather.getWeather(lat, lng)
}).then(weatherResponse => {
    const temperature = weatherResponse.data.currently.temperature;
    const apparentTemperature = weatherResponse.data.currently.apparentTemperature;

    console.log(`Temperature is ${temperature}, feels like ${apparentTemperature}`);
}).catch(error => {
    if (error.code === 'ENOTFOUND') {
        console.log(`Unable to connect to Google Servers, please check your internet connection`)
    } else {
        console.log(error.message);
    }
});



