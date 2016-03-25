
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var validator = validate.validatorjs;
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcryptjs');

var timestamp = require('./plugins/timestamp');

// validation
var usernameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9_]{3,32}$/,
        message: 'Username should be between 3-32 alpha numeric characters, underscore is allowed',
    }),
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'Email is not in valid format',
    }),
];

var Schema = mongoose.Schema;
var UserSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: usernameValidator,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: emailValidator,
    },

    passwordHash: {
        type: String,
        required: true,
    },

    fullname: {
        type: String,
        required: true,
    },

    // possible values: ['admin', 'user', 'developer']
    role: {
        type: [String],
        default: ['user'],
    },

}, { collection: 'users' });

UserSchema.plugin(timestamp.useTimestamps);
UserSchema.plugin(uniqueValidator);

// Password validation
UserSchema.virtual('password')
    .get(function () {
        return this._password;
    })
    .set(function (value) {
        this._password = value;
        this.passwordHash = bcrypt.hashSync(this._password, 10);
    });

UserSchema.virtual('passwordConfirmation')
    .get(function () {
        return this._passwordConfirmation;
    })
    .set(function (value) {
        this._passwordConfirmation = value;
    });

UserSchema.path('passwordHash').validate(function (v) {
    if (this._password || this._passwordConfirmation) {
        if (!validator.isLength(this._password, 8)) {
            this.invalidate('password',
              'Password minimum length is 8 character');
        }

        if (this._password !== this._passwordConfirmation) {
            this.invalidate('passwordConfirmation', 'Password confirmation must match.');
        }
    }

    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required.');
    }
}, null);

UserSchema.methods.passwordMatches = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.passwordHash, function (err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    });
};

UserSchema.method('toJSON', function () {
    const user = this.toObject();
    delete user.passwordHash;
    return user;
});

UserSchema.statics.validate = function (username, password, cb) {
    this.findOne({ $or: [{ email: username }, { username: username }] }, function (err, user) {
        if (err) {
            return cb(err);
        } else {
            if (!user) {
                return cb(new Error('User with username ' + username + ' is not found'));
            } else {
                bcrypt.compare(password, user.passwordHash, function (err, match) {
                    if (err) {
                        return cb(err);
                    } else {
                        if (!match) {
                            return cb(new Error('Incorrect password'));
                        } else {
                            return cb(null, user);
                        }
                    }
                });
            }
        }
    });
};

global.User = mongoose.model('User', UserSchema);
