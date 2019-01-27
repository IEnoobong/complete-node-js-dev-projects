module.exports.add = (a, b) => a + b;

module.exports.asyncAdd = (a, b, callback) => {
    setTimeout(() => {
        callback(a + b);
    }, 1000)
};

module.exports.square = num => num * num;

module.exports.asyncSquare = (num, callback) => {
    setTimeout(() => {
        callback(num * num)
    }, 100)
};

module.exports.setName = (user, fullName) => {
    const names = fullName.split(' ');
    const firstName = names[0];
    const lastName = names[1];
    user.firstName = firstName;
    user.lastName = lastName;
    return user
};