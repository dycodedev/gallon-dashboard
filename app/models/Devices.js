'use strict';

const mongoose = require('mongoose');
const schema = new mongoose.Schema({ }, { collection: 'devices', strict: false });

global.Devices = mongoose.model('devices', schema, 'devices');
