
var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var validator = validate.validatorjs;

var timestamp = require('./plugins/timestamp');

var urlValidator = [
  validate({
      validator: 'isURL',
      arguments: {require_protocol: true},
      message: 'URL is not valid',
  }),
];

var Schema = mongoose.Schema;
var OAuthClientSchema = new Schema({

    _id: {
        type: String,
        default: Utils.uid(32),
        index: true,
    },

    secret: {
        type: String,
        default: Utils.uid(32),
    },

    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: '',
    },

    // possible values: ['default_read', 'default_write'] and maybe others
    scope: {
        type: [String],
        default: ['default_read', 'default_write'],
    },

    // if this app allowed to get token with resource owner password flow
    trusted: {
        type: Boolean,
        default: false,
    },

    // this is for Authorization Code Flow, aka Server-Side Flow
    redirectUri: {
        type: String,
        //validate: urlValidator,
        default: '',
    },

    website: {
        type: String,
        default: '',
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

}, {collection: 'oauth_clients'});

OAuthClientSchema.plugin(timestamp.useTimestamps);

global.OAuthClient = mongoose.model('OAuthClient', OAuthClientSchema);
