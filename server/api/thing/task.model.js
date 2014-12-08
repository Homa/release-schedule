'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Task Schema
var TaskSchema = new Schema({
    title: { type: String, required: true },
    sDate: { type: Date, unique: true },
    fDate: { type: Date, unique: true },
    rDate: { type: Date, unique: true },
    desc:  { type: String },
    order: { type: Number, unique: true }
  });

module.exports = mongoose.model('Task', TaskSchema);
