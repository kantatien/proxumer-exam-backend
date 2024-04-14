const mongoose = require('mongoose');

const ExampleModel = mongoose.model('Example', {name: String});

module.exports = ExampleModel;