
var mongoose = require('mongoose');
var crypto = require('crypto');
var moment = require('moment');

var timestamp = require('./plugins/timestamp');

var Schema = mongoose.Schema;
var OAuthAccessTokenSchema = new Schema({

    tokenHash: {
        type: String,
    },

    // default 6 months from now
    expirationDate: {
        type: Date,
        default: moment().add(6, 'months').toDate(),
    },

    client: {
        type: String,
        required: true,
        ref: 'OAuthClient',
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    scope: {
        type: String,
    },

}, { collection: 'oauth_accesstoken' });

OAuthAccessTokenSchema.virtual('token')
    .get(function () {
        return this._token;
    })
    .set(function (value) {
        this._token = value;
        this.tokenHash = crypto.createHash('sha1').update(this._token).digest('hex');
    });

OAuthAccessTokenSchema.methods.updateExpirationDate = function () {
    this.expirationDate = moment().add(6, 'months').toDate();
    return;
};

OAuthAccessTokenSchema.plugin(timestamp.useTimestamps);

global.OAuthAccessToken = mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
