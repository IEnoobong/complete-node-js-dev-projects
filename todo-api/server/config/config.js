const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'development') {
    process.env.PORT = '3000';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (nodeEnv === 'test') {
    process.env.PORT = '3030';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}