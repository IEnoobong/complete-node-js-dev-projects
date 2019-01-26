const argv = require('./config');
const geocode = require('./geocode/geocode-promise');
const weather = require('./weather/weather-promise');

geocode.geocodeAddress(argv.address).then(location => {
    console.log(location.address);
    return weather.getWeather(location.latitude, location.longitude);
}).then(weather => {
    console.log(JSON.stringify(weather, undefined, 2));
}).catch(reason => {
    console.log(reason);
});

