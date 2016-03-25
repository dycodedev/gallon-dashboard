'use strict';

const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    threshold: Number,
    triggerName: String,
    action: Object,
    user: String,
    device: String,
}, { strict: false, collection: 'triggers' });

global.Triggers = mongoose.model('triggers', schema, 'triggers');
