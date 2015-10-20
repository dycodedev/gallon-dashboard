
var mongoose = require('mongoose');
var monguurl = require('monguurl');

var timestamp = require('./plugins/timestamp');

var Schema = mongoose.Schema;
var CategorySchema = new Schema({

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

    photo: {
        type: String,
    },

    categories: {
        type: [Schema.Types.ObjectId],
    },

}, {collection: config.collection.name('categories')});

CategorySchema.plugin(timestamp.useTimestamps);
CategorySchema.plugin(monguurl({
    source: 'name',
    target: 'slug',
}));

global.Category = mongoose.model('Category', CategorySchema);
