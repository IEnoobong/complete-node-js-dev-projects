const yargs = require('yargs');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true,
            default: '00000'
        }
    })
    .help().alias('help', 'h')
    .argv;

module.exports = {
    address: argv.address
};