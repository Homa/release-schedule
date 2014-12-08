'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TaskSchema = require('./task.model');

// Work Stream Schema
var ThingSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  active: { type: Boolean, default: true },
  tasks: [TaskSchema]
});

module.exports = mongoose.model('Thing', ThingSchema);
