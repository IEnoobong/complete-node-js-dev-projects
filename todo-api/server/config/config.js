const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'development' || nodeEnv === 'test') {
    const config = require('./config.json');
    const envConfig = config[nodeEnv];

    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    })
}