
const util = require('util');
const winston = require('winston');

const config = require('../config/' + process.env.APPCONFIG);

// you can use winston supported various transport here

const production = (process.env.NODE_ENV || '').toLowerCase() === 'production';

const logger = new winston.Logger();

// Override the built-in console methods with winston hooks
switch ((process.env.NODE_ENV || '').toLowerCase()){
    case 'production':
        production = true;

        logger.add(winston.transports.Console, {
            colorize: true,
            timestamp: true,
        });

        break;
    case 'test':

        // Don't set up the logger overrides
        break;
    default:
        logger.add(winston.transports.Console, {
            colorize: true,
            timestamp: true,
        });
        break;
}

function formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = () => {
    logger.info.apply(logger, formatArgs(arguments));
};

console.info = () => {
    logger.info.apply(logger, formatArgs(arguments));
};

console.warn = () => {
    logger.warn.apply(logger, formatArgs(arguments));
};

console.error = () => {
    logger.error.apply(logger, formatArgs(arguments));
};

console.debug = () => {
    logger.debug.apply(logger, formatArgs(arguments));
};
