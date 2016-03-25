
var mongoose = require('mongoose');
var crypto = require('crypto');

var timestamp = require('./plugins/timestamp');

var Schema = mongoose.Schema;
var OAuthRefreshTokenSchema = new Schema({

    tokenHash: {
        type: String,
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

}, { collection: 'oauth_refreshtoken' });

OAuthRefreshTokenSchema.virtual('token')
    .get(function () {
        return this._token;
    })
    .set(function (value) {
        this._token = value;
        this.tokenHash = crypto.createHash('sha1').update(this._token).digest('hex');
    });

OAuthRefreshTokenSchema.plugin(timestamp.useTimestamps);

global.OAuthRefreshToken = mongoose.model('OAuthRefreshToken', OAuthRefreshTokenSchema);
