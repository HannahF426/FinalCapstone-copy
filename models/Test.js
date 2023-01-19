const mongoose = require('mongoose');


// Schema
const testSchema = mongoose.Schema;
const testingSchema = new testSchema({
   title: String,
   body: String 
});

// Model
const Test = mongoose.model('Test', testingSchema);

module.exports = Test;