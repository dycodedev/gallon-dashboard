
var path = require('path');

module.exports = {

    port: process.env.PORT || 9000,
    wsUrl: 'ws://localhost:9090/',

    // database
    mongodb: {
        host: 'localhost',
        port: '27017',
        dbname: 'gallondb',
        username: '',
        password: '',
        connectionUri: 'mongodb://localhost:27017/gallondb',
    },

    collection: {
        prefix: 'hg',
        name: function (collectionName) {
            return this.prefix + '_' + collectionName;
        },
    },

    token: {
        length: 128,
        validMonths: 6,
    },

    appDir: path.join(__dirname, '..'),
    uploadDir: path.join(__dirname, '..', '/assets/upload'),

    // locale
    i18n: {
        defaultLocale: 'en_US',
    },

    // swig
    swig: {
        cache: false,
    },

    // nodemailer
    emailer: {
        service: 'emailService',
        user: 'username',
        pass: 'password',
    },

    cookie: {
        secret: 'BbQqBK8HEj9OrP67hkmyE9gKhPevie3q1gkIaOoUpmjvxkg6iWTkZ9HlLh6Vg7If',
    },

    iot: {
        connectionString: process.env.IOT_CONNECTIONSTR || '',
    },

    dashboard: {
        websocketUrl: 'localhost:9090',
    },
};
