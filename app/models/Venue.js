
var mongoose = require('mongoose');
var monguurl = require('monguurl');

var timestamp = require('./plugins/timestamp');

var Schema = mongoose.Schema;
var VenueSchema = new Schema({

    type: {
        type: String,
        default: 'restaurant',
        enum: ['restaurant'],
    },

    name: {
        type: String,
        required: true,
    },

    slug: {
        type: String,
    },

    description: {
        type: String,
    },

    address: {
        type: String,
    },

    location: {
        type: { type: String, default: 'Point' },
        coordinates: [
          {type: 'Number'},
        ],
    },

    place: {},

    tags: {
        type: [String],
    },

    categories: {
        type: [Schema.Types.ObjectId],
    },

    photos: [{
        caption: {
            type: String,
        },
        url: {
            type: String,
        },
    }],

    links: [{
        type: {
            type: String,
        },
        url: {
            type: String,
        },
    }],

    contacts: [{
        type: {
            type: String,
        },
        value: {
            type: String,
        },
    }],

}, {collection: config.collection.name('venues')});

VenueSchema.plugin(timestamp.useTimestamps);
VenueSchema.plugin(monguurl({
    source: 'name',
    target: 'slug',
}));

global.Venue = mongoose.model('Venue', VenueSchema);
