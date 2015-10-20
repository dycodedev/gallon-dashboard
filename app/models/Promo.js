
var mongoose = require('mongoose');

var timestamp = require('./plugins/timestamp');

var Schema = mongoose.Schema;
var PromoSchema = new Schema({

    description: {
        type: String,
    },

    card: {
        type: String,
        enum: ['cc', 'debit'],
    },

    bank: {
        type: String,
    },

    discount: {
        kind: {
            type: String,
            enum: ['percent', 'nominal'],
        },
        value: {
            type: Number,
        },
        currency: {
            type: String,
            default: 'idr',
        },
    },

    valid: {
        from: {
            type: Date,
        },
        to: {
            type: Date,
        },
    },

    venue: {
        type: Schema.Types.ObjectId,
        required: true,
    },

}, {collection: config.collection.name('promos')});

PromoSchema.plugin(timestamp.useTimestamps);

global.Promo = mongoose.model('Promo', PromoSchema);
